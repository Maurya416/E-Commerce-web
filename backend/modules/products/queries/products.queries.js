const pool = require('../../../config/db');

const ProductQueries = {
    getAllProducts: async (filters = {}) => {
        let sql = `
            SELECT p.*, c.title AS category_name, b.name AS brand_name,
            (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1) AS card_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.category_id) {
            sql += ' AND p.category_id = ?';
            params.push(filters.category_id);
        }

        if (filters.brand_id) {
            sql += ' AND p.brand_id = ?';
            params.push(filters.brand_id);
        }

        if (filters.condition) {
            sql += ' AND p.id IN (SELECT product_id FROM concern_products WHERE concern_id = ?)';
            params.push(filters.condition);
        }

        if (filters.is_doctor_choice) {
            sql += ' AND p.is_doctor_choice = ?';
            params.push(filters.is_doctor_choice);
        }

        const [rows] = await pool.execute(sql, params);
        return rows;
    },

    getProductBySlug: async (slug) => {
        const [rows] = await pool.execute(
            `
            SELECT p.*, c.title AS category_name, b.name AS brand_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            WHERE p.slug = ?
        `,
            [slug]
        );

        if (rows.length === 0) return null;
        const product = rows[0];

        const [images] = await pool.execute(
            'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order, id',
            [product.id]
        );
        product.gallery = images.map((img) => img.image_url);

        const [benefits] = await pool.execute(
            'SELECT benefit_text FROM product_benefits WHERE product_id = ? ORDER BY id',
            [product.id]
        );
        product.shortBenefits = benefits.map((b) => b.benefit_text);

        const [trustRows] = await pool.execute(
            'SELECT id, title, icon_url AS icon FROM product_trust_points WHERE product_id = ? ORDER BY sort_order, id',
            [product.id]
        );
        product.trustPoints = trustRows.map((tp) => ({
            id: tp.id,
            title: tp.title,
            icon: tp.icon,
        }));

        const [faqs] = await pool.execute(
            'SELECT question, answer FROM product_faqs WHERE product_id = ? ORDER BY id',
            [product.id]
        );
        // Fallback FAQs if empty
        product.faqs = faqs.length > 0 ? faqs : [
            {
                question: "What skin types is this product suitable for?",
                answer: "It is generally suitable for all skin types, especially those with sensitive or acne-prone concerns."
            },
            {
                question: "How often should I use this product?",
                answer: "For best results, use it twice daily as part of your morning and evening skincare routine."
            },
            {
                question: "Is this product dermatologist-tested?",
                answer: "Yes, it is formulated and tested by dermatologists to ensure safety and effectiveness."
            }
        ];

        const [questions] = await pool.execute(
            `
            SELECT id, initial_char AS initial, name, question, answer 
            FROM product_questions WHERE product_id = ? ORDER BY sort_order, id
        `,
            [product.id]
        );
        // Fallback Questions if empty
        product.productQuestions = questions.length > 0 ? questions : [
            { initial: 'T', name: 'Tasmia', question: "Is this suitable for oily sensitive skin?", answer: "Yes, it is oil-free and non-comedogenic." },
            { initial: 'S', name: 'Sakshi', question: "What is the expiry date?", answer: "At least 6 months from the date of purchase." }
        ];

        const [reviews] = await pool.execute(
            `
            SELECT id, reviewer_initial AS initial, reviewer_name AS name, 
                   is_verified AS verified, review_title AS title, rating, comment
            FROM product_reviews WHERE product_id = ? ORDER BY id
        `,
            [product.id]
        );
        // Fallback Reviews if empty
        product.productReviews = reviews.length > 0 ? reviews : [
            { initial: 'A', name: 'Aarthi', verified: true, rating: 4, title: "Great product", comment: "Really helped with my skin concerns." },
            { initial: 'S', name: 'Sinchana', verified: true, rating: 5, title: "Amazing", comment: "My skin feels much better now." }
        ];

        const [better] = await pool.execute(
            `
            SELECT id, name, image_url AS image, rating, reviews, price, old_price AS oldPrice
            FROM product_better_results WHERE parent_product_id = ? ORDER BY sort_order, id
        `,
            [product.id]
        );
        product.betterResultsProducts = better;

        const [press] = await pool.execute('SELECT id, name, image_url AS image FROM press_logos ORDER BY sort_order, id');
        product.featuredInData = press;

        const [featureRows] = await pool.execute(
            'SELECT id, title, subtitle, image_url AS image FROM features ORDER BY id'
        );
        product.features = featureRows;

        // Fetch Trending Products (most added to carts, excluding current)
        const [trending] = await pool.execute(
            `SELECT p.id, p.name, p.slug, p.price, p.old_price AS oldPrice, p.rating, p.review_count AS reviews, 
             (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1) AS image 
             FROM products p WHERE p.id != ? ORDER BY recently_in_carts DESC LIMIT 5`,
            [product.id]
        );
        product.trendingProducts = trending;

        // Fetch Similar Products (same category, excluding current)
        const [similar] = await pool.execute(
            `SELECT p.id, p.name, p.slug, p.price, p.old_price AS oldPrice, p.rating, p.review_count AS reviews, 
             (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1) AS image 
             FROM products p WHERE p.category_id = ? AND p.id != ? ORDER BY p.rating DESC LIMIT 5`,
            [product.category_id, product.id]
        );
        product.similarProducts = similar;

        // Fallback for Better Results if empty
        if (product.betterResultsProducts.length === 0) {
            product.betterResultsProducts = similar.slice(0, 5);
        }

        product.reviews = product.review_count;
        product.taxText = product.tax_text;
        product.savePercent = product.save_percent;
        product.hurryText = product.hurry_text;
        product.deliveryText = product.delivery_text;
        product.offersTitle = product.offers_title;
        product.oldPrice = product.old_price;
        product.recentlyInCarts = product.recently_in_carts;

        // If gallery has only 1 image, duplicate it to show thumbnails as requested
        if (product.gallery && product.gallery.length === 1) {
            const singleImg = product.gallery[0];
            product.gallery = [singleImg, singleImg, singleImg, singleImg];
        }

        return product;
    },

    getFeaturedProducts: async (limit = 10) => {
        const [rows] = await pool.execute('SELECT * FROM products ORDER BY recently_in_carts DESC LIMIT ?', [limit]);
        return rows;
    },
};

module.exports = ProductQueries;
