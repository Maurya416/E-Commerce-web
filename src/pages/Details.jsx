import React, { useEffect, useMemo, useState, useRef, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchApi } from "../api/client.js";
import {
    Check,
    CheckCircle,
    ChevronDown,
    CheckCircle2,
    Droplets,
    FlaskConical,
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Zap,
    Search,
    Truck,
    ChevronLeft,
    ChevronRight,
    MapPin,
    ArrowLeft,
    ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";

import offer1 from "../assets/images/details/free.avif";
import offer2 from "../assets/images/details/icon_1e044234-7684-4237-866b-dc649f7bd04c.avif";
import offer3 from "../assets/images/details/free.avif";
import offer4 from "../assets/images/details/icon_1e044234-7684-4237-866b-dc649f7bd04c.avif";

function Details() {
    const { slug } = useParams();
    const slugResolved = slug || "accare-foaming-face-wash";
    const [product, setProduct] = useState(null);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoadError(null);
        fetchApi(`/api/products/${encodeURIComponent(slugResolved)}`)
            .then((data) => {
                if (!cancelled) setProduct(data);
            })
            .catch((e) => {
                if (!cancelled) setLoadError(e.message);
            });
        return () => {
            cancelled = true;
        };
    }, [slugResolved]);

    const [selectedImage, setSelectedImage] = useState("");
    useEffect(() => {
        if (product?.gallery?.[0]) setSelectedImage(product.gallery[0]);
    }, [product]);

    const [qty, setQty] = useState(1);
    useEffect(() => {
        if (product?.quantity != null) setQty(product.quantity);
    }, [product]);

    const [pincode, setPincode] = useState("");
    const [activeOffer, setActiveOffer] = useState(0);

    const offerImages = [offer1, offer2, offer3, offer4];

    const currentImageIndex = useMemo(() => {
        if (!product?.gallery?.length) return 0;
        const i = product.gallery.findIndex((img) => img === selectedImage);
        return i < 0 ? 0 : i;
    }, [product, selectedImage]);

    const decreaseQty = () => {
        setQty((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const increaseQty = () => {
        setQty((prev) => prev + 1);
    };

    const showPrevImage = () => {
        if (!product?.gallery?.length) return;
        const prevIndex =
            currentImageIndex === 0 ? product.gallery.length - 1 : currentImageIndex - 1;
        setSelectedImage(product.gallery[prevIndex]);
    };

    const showNextImage = () => {
        if (!product?.gallery?.length) return;
        const nextIndex =
            currentImageIndex === product.gallery.length - 1 ? 0 : currentImageIndex + 1;
        setSelectedImage(product.gallery[nextIndex]);
    };

    const prevOffer = () => {
        setActiveOffer((prev) =>
            prev === 0 ? offers.length - 1 : prev - 1
        );
    };

    const nextOffer = () => {
        setActiveOffer((prev) =>
            prev === offers.length - 1 ? 0 : prev + 1
        );
    };

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    const [openSections, setOpenSections] = useState({
        description: true,
        benefits: false,
        usage: false,
        ingredients: false,
    });

    const toggleSection = (key) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };


    const sliderRef = useRef(null);



    const reviewCount = product?.productReviews?.length ?? 0;
    const questionCount = product?.productQuestions?.length ?? 0;
    const [activeTab, setActiveTab] = useState("reviews");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 0,
        title: "",
        content: "",
        name: "",
        email: "",
    });
    const [questionForm, setQuestionForm] = useState({
        name: "",
        email: "",
        question: "",
    });

    const openReviewForm = () => {
        setActiveTab("reviews");
        setShowReviewForm(true);
        setShowQuestionForm(false);
    };

    const openQuestionForm = () => {
        setActiveTab("questions");
        setShowQuestionForm(true);
        setShowReviewForm(false);
    };

    const handleSubmitReview = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const newReview = {
            id: Date.now(),
            initial: reviewForm.name ? reviewForm.name.charAt(0).toUpperCase() : "U",
            rating: reviewForm.rating,
            name: reviewForm.name || "Anonymous",
            title: reviewForm.title,
            comment: reviewForm.content,
            verified: false,
        };
        setProduct((prev) => ({ ...prev, productReviews: [newReview, ...(prev?.productReviews || [])] }));
        setReviewForm({ rating: 0, title: "", content: "", name: "", email: "" });
        setShowReviewForm(false);
    };

    const handleSubmitQuestion = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const newQuestion = {
            id: Date.now(),
            initial: questionForm.name ? questionForm.name.charAt(0).toUpperCase() : "U",
            name: questionForm.name || "Anonymous",
            question: questionForm.question,
            answer: "",
        };
        setProduct((prev) => ({ ...prev, productQuestions: [newQuestion, ...(prev?.productQuestions || [])] }));
        setQuestionForm({ name: "", email: "", question: "" });
        setShowQuestionForm(false);
    };




    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    const visibleCount = useMemo(() => {
        if (typeof window === "undefined") return 5;
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 3;
        return 5;
    }, []);

    const [slidesToShow, setSlidesToShow] = useState(5);

    useEffect(() => {
        const updateSlidesToShow = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(3);
            } else {
                setSlidesToShow(5);
            }
        };

        updateSlidesToShow();
        window.addEventListener("resize", updateSlidesToShow);
        return () => window.removeEventListener("resize", updateSlidesToShow);
    }, []);

    const pressLogos = product?.featuredInData ?? [];
    const maxIndex = Math.max(pressLogos.length - slidesToShow, 0);

    useEffect(() => {
        if (!pressLogos.length) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 2500);

        return () => clearInterval(intervalRef.current);
    }, [pressLogos.length, maxIndex]);

    const pauseAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const resumeAutoSlide = () => {
        if (!pressLogos.length) return;

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 2500);
    };



    const accordionData = [
        {
            key: "description",
            title: "Product Description",
            content: (
                <p className="text-[15px] leading-8 text-[#6b7280] sm:text-[17px]">
                    Acnechio Deep Cleansing Gel Face Wash is a gentle yet effective
                    formula designed to combat acne while deeply cleansing the skin. This
                    face wash is enriched with salicylic acid that helps remove excess oil,
                    dirt, and impurities while keeping the skin fresh and clean.This
                    face wash is enriched with salicylic acid that helps remove excess oil,
                    dirt, and impurities while keeping the skin fresh and clean.
                </p>
            ),
        },
        {
            key: "benefits",
            title: "Key Benefits",
            content: (
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-[#22c55e]" />
                        <p className="text-[15px] leading-7 text-[#6b7280] sm:text-[17px]">
                            Deeply cleanses pores, removing excess oil, dirt, and impurities.
                        </p>
                    </div>

                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-[#22c55e]" />
                        <p className="text-[15px] leading-7 text-[#6b7280] sm:text-[17px]">
                            Contains salicylic acid and tea tree oil to combat acne and
                            prevent new breakouts.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "usage",
            title: "How to Use",
            content: (
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Droplets className="mt-0.5 h-7 w-7 shrink-0 text-[#a855f7]" />
                        <p className="text-[15px] leading-7 text-[#6b7280] sm:text-[17px]">
                            Application: Wet your face with lukewarm water and apply a small
                            amount of the gel face wash.
                        </p>
                    </div>
                    <div className="flex items-start gap-4">
                        <Droplets className="mt-0.5 h-7 w-7 shrink-0 text-[#a855f7]" />
                        <p className="text-[15px] leading-7 text-[#6b7280] sm:text-[17px]">
                            Application: Wet your face with lukewarm water and apply a small
                            amount of the gel face wash.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "ingredients",
            title: "Key Ingredients",
            content: (
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <FlaskConical className="mt-0.5 h-7 w-7 shrink-0 text-[#a855f7]" />
                        <p className="text-[15px] leading-7 text-[#6b7280] sm:text-[17px]">
                            Salicylic Acid
                        </p>
                    </div>

                    <div className="flex items-start gap-4">
                        <FlaskConical className="mt-0.5 h-7 w-7 shrink-0 text-[#a855f7]" />
                        <p className="text-[15px] leading-7 text-[#6b7280]  sm:text-[17px]">
                            Tea Tree Oil
                        </p>
                    </div>

                    <div className="flex items-start gap-4">
                        <FlaskConical className="mt-0.5 h-7 w-7 shrink-0 text-[#a855f7]" />
                        <p className="text-[15px] leading-7 text-[#6b7280]  sm:text-[17px]">
                            Vitamin E
                        </p>
                    </div>

                    <div className="flex items-start gap-4">
                        <FlaskConical className="mt-0.5 h-7 w-7 shrink-0 text-[#a855f7]" />
                        <p className="text-[15px] leading-7 text-[#6b7280]  sm:text-[17px]">
                            Green Tea Extract
                        </p>
                    </div>

                    <div className="flex items-start gap-4">
                        <FlaskConical className="mt-0.5 h-7 w-7 shrink-0 text-[#a855f7]" />
                        <p className="text-[15px] leading-7 text-[#6b7280]  sm:text-[17px]">
                            Panthenol
                        </p>
                    </div>
                </div>
            ),
        },
    ];



    const offers = [
        {
            image: offer1,
            title: "Pay later at checkout",
            subtitle: "Instant EMI | No credit card apply",
            badge: "1/4",
        },
        {
            image: offer2,
            title: "Flat 10% off on prepaid",
            subtitle: "Use UPI or cards",
            badge: "2/4",
        },
        {
            image: offer3,
            title: "Extra cashback offer",
            subtitle: "On selected wallets",
            badge: "3/4",
        },
        {
            image: offer4,
            title: "Free dermatologist consult",
            subtitle: "On orders above ₹999",
            badge: "4/4",
        },
    ];



    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.gallery?.[0] || product.image,
        });
    };

    const handleBuyNow = async () => {
        if (!product) return;
        await addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.gallery?.[0] || product.image,
        });
        navigate("/checkout");
    };

    if (loadError) {
        return (
            <div className="p-8 text-center text-red-600">{loadError}</div>
        );
    }
    if (!product) {
        return <div className="p-8 text-center text-gray-600">Loading…</div>;
    }

    return (
        <div className="bg-white">
            <section className="bg-[#f3f4f6] py-3 sm:py-6 lg:py-8">
                <div className="px-3 md:px-6 lg:px-12">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[54%_46%] xl:gap-8">
                        {/* LEFT SIDE */}
                        <div className="space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[92px_minmax(0,1fr)]">
                                {/* Desktop/Tablet Thumbnails */}
                                <div className="order-2 hidden gap-3 overflow-x-auto md:order-1 md:flex md:flex-col md:overflow-visible">
                                    {product.gallery.map((img, index) => {
                                        const active = selectedImage === img;

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(img)}
                                                className={`flex h-[82px] min-w-[82px] items-center justify-center overflow-hidden rounded-lg border bg-white p-2 shadow-sm transition ${active
                                                    ? "border-[#8b3dff] ring-2 ring-[#8b3dff]/20"
                                                    : "border-[#e5e7eb] hover:border-[#c084fc]"
                                                    }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`thumb-${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Main Image */}
                                <div className="order-1 md:order-2">
                                    <div className="relative overflow-hidden rounded-lg bg-white sm:rounded-lg">
                                        <div className="flex min-h-[200px] items-center justify-center md:min-h-[420px] lg:min-h-[460px]">
                                            <img
                                                src={selectedImage}
                                                alt={product.name}
                                                className="max-h-[180px] w-auto object-contain md:max-h-[360px] lg:max-h-[430px]"
                                            />
                                        </div>


                                    </div>

                                    {/* Mobile arrows + dots */}
                                    <div className="mt-3 flex items-center justify-between md:hidden">
                                        <button
                                            onClick={showPrevImage}
                                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#2b2b2b]"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {product.gallery.map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`h-1.5 w-1.5 rounded-full ${currentImageIndex === index
                                                        ? "bg-[#111827]"
                                                        : "bg-[#c4c4c4]"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            onClick={showNextImage}
                                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#2b2b2b]"
                                        >
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Points */}
                            <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-[#c084fc] bg-white md:rounded-lg">
                                {product.trustPoints.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col items-center justify-center md:px-2 md:py-2 pt-1 text-center ${index !== product.trustPoints.length - 1
                                            ? "border-r border-[#c084fc]"
                                            : ""
                                            }`}
                                    >
                                        <img
                                            src={item.icon}
                                            alt={item.title}
                                            className="mb-1 h-6 w-8 object-contain sm:h-6 sm:w-10"
                                        />
                                        <p className="text-xs font-normal text-black md:text-md">
                                            {item.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div>
                            <div className="space-y-4 sm:space-y-5">

                                {/* Title */}
                                <div>
                                    <h1 className="text-[18px] font-semibold leading-tight text-black sm:text-3xl lg:text-2xl">
                                        {product.name}
                                    </h1>

                                    {/* Benefits */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                        {product.shortBenefits.map((item, index) => (
                                            <div key={index} className="flex items-center gap-1">
                                                <CheckCircle className="h-4 w-4 fill-green-600 text-green-600" />
                                                <span className="text-[12px] font-bold text-[#15803d] sm:text-base">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop/Tablet rating */}
                                    <div className="mt-3 hidden flex-wrap items-center gap-2 sm:flex">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, index) => (
                                                <Star
                                                    key={index}
                                                    className={`h-5 w-5 ${index < 4
                                                        ? "fill-[#f4b400] text-[#f4b400]"
                                                        : "text-[#f4b400]"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <span className="text-md font-medium text-black">
                                            {product.rating}
                                        </span>

                                        <span className="text-sm font-semibold text-[#111827]">
                                            ({product.reviews} Reviews)
                                        </span>
                                    </div>
                                </div>

                                {/* Price row */}
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 sm:items-end">
                                    <span className="text-[16px] text-[#6b7280] line-through sm:text-xl">
                                        ₹{product.oldPrice}
                                    </span>

                                    <span className="text-[20px] font-bold text-[#0a8f08] sm:text-xl">
                                        ₹ {product.price}
                                    </span>

                                    <span className="rounded-md bg-[#8b3dff] px-2 py-1 text-[12px] font-bold text-white">
                                        SAVE {product.savePercent}%
                                    </span>

                                    <span className="ml-auto rounded-md border border-[#9a6500] bg-[#f7a600] px-3 py-1 text-[12px] font-bold text-white sm:hidden">
                                        {product.hurryText}
                                    </span>

                                    <span className="w-full text-[12px] text-[#6b7280] sm:hidden">
                                        {product.taxText}
                                    </span>
                                </div>

                                {/* Desktop tax */}
                                <div className="hidden sm:block">
                                    <span className="text-sm text-[#111827]">{product.taxText}</span>
                                </div>

                                {/* Size + Qty (Mobile Fix) */}
                                <div className="flex items-center justify-between gap-3 sm:border-b sm:border-[#e5e7eb] sm:pb-5">
                                    {/* Size */}
                                    <div className="flex items-center gap-2">
                                        <p className="text-[16px] font-medium text-[#374151] sm:text-lg sm:font-semibold">
                                            Size:
                                        </p>

                                        <button className="rounded-lg border border-[#8b3dff] bg-white px-2 py-1 text-[16px] font-normal text-black transition hover:bg-[#faf5ff] sm:px-2 sm:py-1 sm:text-2xl">
                                            {product?.size}
                                        </button>
                                    </div>

                                    {/* Qty (ONLY mobile) */}
                                    <div className="flex h-[35px] items-center gap-2 rounded-lg px-1 sm:hidden">

                                        <span className="text-[13px] font-semibold text-[#111827]">
                                            Qty:
                                        </span>

                                        <div className="flex items-center gap-0.6">
                                            <button
                                                onClick={decreaseQty}
                                                className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-200 text-[#4b5563]"
                                            >
                                                <Minus className="h-41 w-4" />
                                            </button>

                                            <span className="min-w-[20px] text-center text-[16px] font-medium text-[#111827]">
                                                {qty}
                                            </span>

                                            <button
                                                onClick={increaseQty}
                                                className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-200 text-[#4b5563]"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-base">📈</span>
                                    <span className="text-[12px] font-semibold text-[#15803d]">
                                        Recently in {product.recentlyInCarts} carts
                                    </span>
                                </div>

                                {/* MOBILE BUTTONS */}
                                <div className="grid grid-cols-2 gap-3 sm:hidden">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex h-[48px] items-center justify-center gap-2 rounded-xl border border-[#8b3dff] bg-white px-3 text-[16px] font-semibold text-[#8b3dff]">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e8ff]">
                                            <ShoppingCart className="h-4 w-4" />
                                        </span>
                                        Add to cart
                                    </button>

                                    <button
                                        onClick={handleBuyNow}
                                        className="flex h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-3 text-[16px] font-semibold text-white">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#8b3dff]">
                                            <Zap className="h-4 w-4 fill-current" />
                                        </span>
                                        Buy It Now
                                    </button>
                                </div>

                                {/* MOBILE DELIVERY */}
                                <div className="flex items-center justify-between gap-3 sm:hidden">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-black" />
                                        <span className="text-[13px] font-medium text-[#111827]">
                                            {product.deliveryText}
                                        </span>
                                    </div>
                                </div>

                                {/* MOBILE OFFERS */}
                                <div className="sm:hidden">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="text-base">🪙</span>
                                        <h3 className="text-[14px] font-medium text-[#374151]">
                                            {product.offersTitle}
                                        </h3>
                                    </div>

                                    <div className="relative flex items-center gap-2 rounded-2xl bg-[#efe0bc]">
                                        <button
                                            onClick={prevOffer}
                                            className="flex h-8 w-8 items-center justify-center text-[#8b3dff]"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>

                                        {/* IMAGE */}
                                        <img
                                            src={offers[activeOffer].image}
                                            alt="offer"
                                            className="h-[60px] w-[60px] object-contain"
                                        />

                                        {/* TEXT */}
                                        <div className="flex-1">
                                            <h4 className="text-[13px] font-semibold text-[#3b2f18]">
                                                {offers[activeOffer].title}
                                            </h4>
                                            <p className="text-[11px] text-[#5b4a2c]">
                                                {offers[activeOffer].subtitle}
                                            </p>
                                        </div>

                                        {/* BADGE + NEXT */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-[12px] font-bold">
                                                {offers[activeOffer].badge}
                                            </span>

                                            <button onClick={nextOffer}>
                                                <ChevronRight className="h-5 w-5 text-[#8b3dff]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* MOBILE PINCODE */}
                                <div className="sm:hidden">
                                    <h3 className="mb-2 text-[14px] font-medium text-[#374151]">
                                        Select Delivery Location
                                    </h3>

                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                placeholder="Enter Pincode"
                                                className="h-[44px] w-full rounded-xl border border-[#d1d5db] bg-white pl-10 pr-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#8b3dff]"
                                            />
                                        </div>

                                        <button className="h-[44px] rounded-xl bg-[#8b3dff] px-4 text-[14px] font-semibold text-white">
                                            Check
                                        </button>
                                    </div>
                                </div>

                                {/* DESKTOP/TABLET QTY + BUTTONS */}
                                <div className="hidden flex-col gap-6 sm:flex xl:flex-row">
                                    <div className="flex h-[50px] w-full items-center justify-between rounded-lg px-3 xl:w-[120px]">
                                        <span className="text-md font-semibold text-[#111827]">
                                            Qty:
                                        </span>

                                        <div className="flex gap-0.5 items-center">
                                            <button
                                                onClick={decreaseQty}
                                                className="rounded-sm p-0.3 text-[#4b5563] transition bg-gray-200 cursor-pointer"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>

                                            <span className="min-w-[18px] text-center text-xl font-medium text-[#111827]">
                                                {qty}
                                            </span>

                                            <button
                                                onClick={increaseQty}
                                                className="rounded-sm p-0.3 text-[#4b5563] transition bg-gray-200 cursor-pointer"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-[#8b3dff] bg-white text-xl font-semibold text-[#8b3dff] transition hover:bg-[#faf5ff] xl:flex-1 cursor-pointer">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3e8ff]">
                                            <ShoppingCart className="h-6 w-6" />
                                        </span>
                                        Add to cart
                                    </button>

                                    <button
                                        onClick={handleBuyNow}
                                        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-xl font-semibold text-white transition hover:opacity-95 xl:flex-1 cursor-pointer">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#8b3dff]">
                                            <Zap className="h-6 w-6 fill-current" />
                                        </span>
                                        Buy It Now
                                    </button>
                                </div>

                                {/* DESKTOP/TABLET CART + DELIVERY */}
                                <div className="hidden flex-col border-t border-[#e5e7eb] pt-5 sm:flex xl:flex-row xl:items-center xl:justify-between">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">📈</span>
                                            <span className="text-md font-normal text-[#0a8f08]">
                                                Recently in {product.recentlyInCarts} carts
                                            </span>
                                        </div>

                                        <span className="rounded-lg bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#fff7d6] px-2 py-1 text-sm font-bold text-[#92400e] shadow-sm">
                                            {product.hurryText}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Truck className="h-6 w-6 text-black" />
                                        <span className="text-lg font-normal text-[#111827]">
                                            {product.deliveryText}
                                        </span>
                                    </div>
                                </div>

                                {/* DESKTOP/TABLET OFFERS */}
                                <div className="hidden sm:block">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="text-md">🪙</span>
                                        <h3 className="text-md font-medium text-gray-600">
                                            {product.offersTitle}
                                        </h3>
                                    </div>

                                    <div className="relative flex items-center gap-3 rounded-lg bg-[#efe0bc]">
                                        <button onClick={prevOffer}>
                                            <ChevronLeft className="h-6 w-6 text-[#8b3dff]" />
                                        </button>

                                        {/* IMAGE */}
                                        <img
                                            src={offers[activeOffer].image}
                                            alt="offer"
                                            className="h-[80px] w-[80px] object-contain"
                                        />

                                        {/* TEXT */}
                                        <div className="flex-1">
                                            <h4 className="text-md font-semibold text-black">
                                                {offers[activeOffer].title}
                                            </h4>
                                            <p className="text-sm text-[#5b4a2c]">
                                                {offers[activeOffer].subtitle}
                                            </p>
                                        </div>

                                        {/* BADGE */}
                                        <span className="text-lg font-medium">
                                            {offers[activeOffer].badge}
                                        </span>

                                        <button onClick={nextOffer}>
                                            <ChevronRight className="h-6 w-6 text-[#8b3dff]" />
                                        </button>
                                    </div>
                                </div>

                                {/* DESKTOP/TABLET PINCODE */}
                                <div className="hidden sm:block">
                                    <h3 className="mb-2 text-lg font-normal text-[#374151]">
                                        Select Delivery Location
                                    </h3>

                                    <div className="flex flex-col gap-1 sm:flex-row">
                                        <div className="relative flex-1">
                                            <MapPin className="pointer-events-none absolute left-4 top-6 h-5 w-5 -translate-y-1/2 text-[#9ca3af]" />
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                placeholder="Enter Pincode"
                                                className="h-[50px] w-full rounded-2xl border border-[#d1d5db] bg-white pl-12 pr-4 text-lg text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#8b3dff]"
                                            />
                                        </div>

                                        <button className="h-[50px] rounded-2xl bg-[#8b3dff] px-4 text-xl font-semibold text-white transition hover:bg-[#7c2df1] sm:min-w-[100px]">
                                            Check
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white lg:py-1">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.9fr] lg:gap-12">
                        {/* LEFT SIDE */}
                        <div>
                            {accordionData.map((section) => (
                                <div
                                    key={section.key}
                                    className="py-4 md:py-5"
                                >
                                    <button
                                        onClick={() => toggleSection(section.key)}
                                        className="flex w-full items-center justify-between gap-4 text-left"
                                    >
                                        <h3 className="text-md font-normal text-black md:text-xl">
                                            {section.title}
                                        </h3>

                                        <ChevronDown
                                            className={`h-6 w-6 shrink-0 text-[#8b3dff] transition-transform duration-300 ${openSections[section.key] ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${openSections[section.key]
                                            ? "grid-rows-[1fr] pt-5 opacity-100"
                                            : "grid-rows-[0fr] pt-0 opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">{section.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="hidden md:grid md:grid-cols-2 gap-4">
                            {product.betterResultsProducts.slice(0, 2).map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-lg bg-white shadow-lg w-60 h-80 p-2"
                                >
                                    <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-lg bg-white">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-[130px] w-auto object-contain"
                                        />
                                    </div>

                                    <h3 className="min-h-[40px] text-md font-normal text-black">
                                        {item.name}
                                    </h3>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, index) => {
                                                const filled = index < Math.floor(item.rating || 4);
                                                return (
                                                    <Star
                                                        key={index}
                                                        className={`h-4 w-5 ${filled
                                                            ? "fill-[#f4b400] text-[#f4b400]"
                                                            : "fill-[#e5e7eb] text-[#e5e7eb]"
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </div>

                                        <span className="text-sm text-[#6b7280]">
                                            ( {item.reviews} Reviews )
                                        </span>
                                    </div>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className="text-[18px] font-bold text-[#0a8f08]">
                                            ₹ {item.price}
                                        </span>

                                        {item.oldPrice && (
                                            <span className="text-[16px] font-semibold text-[#b9bec8] line-through">
                                                ₹ {item.oldPrice}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => addToCart({
                                            id: item.id,
                                            name: item.name,
                                            price: item.price,
                                            image: item.gallery?.[0] || item.image,
                                        })}
                                        className="mt-2 cursor-pointer w-full rounded-lg border border-[#8b3dff] px-3 py-2 text-md font-semibold text-[#8b3dff]">
                                        Add to Cart
                                    </button>
                                </div>
                            ))}

                            {/* ADVERTISEMENT BANNER 1 (FULL WIDTH) */}
                            <div className="col-span-2 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#8b3dff] to-[#6b3d9b] p-4 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-normal uppercase ">
                                            Advertisement
                                        </p>
                                        <h3 className="mt-2 text-lg font-normal">
                                            Flat 20% Off on Premium Care
                                        </h3>
                                        <p className="text-sm text-white/90 mt-1">
                                            Limited time offer on skincare products.
                                        </p>
                                    </div>

                                    <button className="rounded-lg bg-white px-4 py-2 text-sm font-normal text-[#8b3dff]">
                                        Shop Now
                                    </button>
                                </div>
                            </div>

                            {/* ADVERTISEMENT BANNER 2 (FULL WIDTH) */}
                            <div className="col-span-2 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#ff8a00] to-[#c78528] p-4 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-normal uppercase">
                                            Advertisement
                                        </p>
                                        <h3 className="mt-2 text-lg font-normal">
                                            Buy 1 Get 1 Free Combo
                                        </h3>
                                        <p className="text-sm text-white/90 mt-1">
                                            Special combo deals available now.
                                        </p>
                                    </div>

                                    <button className="rounded-md bg-white px-4 py-2 text-sm font-normal text-[#ff8a00]">
                                        Explore
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="w-full py-10">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {product.features.map((item, index) => (
                            <div
                                key={item.id}
                                className={`
                flex items-center gap-3 md:gap-4 px-2 md:px-3 py-3 md:py-2 border border-gray-300 rounded-lg
                ${index !== product.features.length - 1}
              `}
                            >
                                <div className="shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-10 w-10 sm:w-16 md:h-16 md:w-20 object-contain"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-sm sm:text-base md:text-[18px] font-semibold text-[#222] leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm md:text-[15px] text-[#8d93a6] leading-tight">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>




            <section className="w-full bg-[#f3f4f6] py-10 sm:py-12 lg:py-6">
                <div className="px-4 md:px-6 ">
                    <h2 className="text-center text-xl font-semibold text-black md:text-2xl">
                        For better results, don’t miss:
                    </h2>

                    {/* Desktop / Tablet */}
                    <div className="mt-6 hidden md:grid md:grid-cols-5 md:gap-5 lg:gap-6">
                        {product.betterResultsProducts.slice(0, 5).map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex h-[160px] items-center justify-center overflow-hidden rounded-lg bg-white">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-[130px] w-auto object-contain"
                                    />
                                </div>

                                <h3 className="min-h-[40px] text-md font-normal text-black">
                                    {item.name}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, index) => {
                                            const filled = index < Math.floor(item.rating || 4);
                                            return (
                                                <Star
                                                    key={index}
                                                    className={`h-4 w-4 ${filled
                                                        ? "fill-[#f4b400] text-[#f4b400]"
                                                        : "fill-[#e5e7eb] text-[#e5e7eb]"
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>

                                    <span className="text-[15px] text-[#6b7280]">
                                        ( {item.reviews} Reviews )
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="text-[18px] font-bold text-[#0a8f08]">
                                        ₹ {item.price}
                                    </span>

                                    {item.oldPrice && (
                                        <span className="text-[16px] font-semibold text-[#b9bec8] line-through">
                                            ₹ {item.oldPrice}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        image: item.gallery?.[0] || item.image,
                                    })}
                                    className="mt-1 cursor-pointer w-full rounded-lg border border-[#8b3dff] px-3 py-2 text-md font-semibold text-[#8b3dff]">
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Slider */}
                    <div className="relative mt-6 md:hidden">
                        <div
                            ref={sliderRef}
                            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
                        >
                            {product.betterResultsProducts.map((item) => (
                                <div
                                    key={item.id}
                                    className="min-w-[50%] snap-center rounded-lg bg-white p-3"
                                >
                                    <div className="flex h-[90px] items-center justify-center overflow-hidden rounded-[14px]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-[110px] w-auto object-contain"
                                        />
                                    </div>

                                    <h3 className="mt-3 min-h-[50px] text-md font-semibold  text-black">
                                        {item.name}
                                    </h3>

                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, index) => {
                                                const filled = index < Math.floor(item.rating || 4);
                                                return (
                                                    <Star
                                                        key={index}
                                                        className={`h-4 w-4 ${filled
                                                            ? "fill-[#f4b400] text-[#f4b400]"
                                                            : "fill-[#e5e7eb] text-[#e5e7eb]"
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </div>

                                        <span className="text-sm text-[#6b7280]">
                                            ({item.reviews})
                                        </span>
                                    </div>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className="text-md font-bold text-[#0a8f08]">
                                            ₹ {item.price}
                                        </span>

                                        {item.oldPrice && (
                                            <span className="text-md font-semibold text-[#b9bec8] line-through">
                                                ₹ {item.oldPrice}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => addToCart({
                                            id: item.id,
                                            name: item.name,
                                            price: item.price,
                                            image: item.gallery?.[0] || item.image,
                                        })}
                                        className="mt-3 w-full rounded-lg border border-[#8b3dff] px-4 py-2.5 text-[16px] font-semibold text-[#8b3dff] transition hover:bg-[#faf5ff]">
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            <section className="w-full bg-[#f3f4f6] py-8 sm:py-10 lg:py-12">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-md font-semibold leading-tight text-[#111827] md:text-2xl">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="divide-y divide-[#d8d8d8] border-t border-[#d8d8d8]">
                        {product.faqs.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div key={faq.id || index} className="py-4">
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(index)}
                                        className="flex w-full items-start justify-between gap-4 text-left"
                                    >
                                        <span className="pr-2 text-md font-normal text-black md:text-md">
                                            {faq.question}
                                        </span>

                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                                            <ChevronDown
                                                className={`h-6 w-6 text-[#8b3dff] transition-transform duration-300 sm:h-7 sm:w-7 ${isOpen ? "rotate-180" : "rotate-0"
                                                    }`}
                                            />
                                        </span>
                                    </button>

                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen
                                            ? "grid-rows-[1fr] pt-4 opacity-100"
                                            : "grid-rows-[0fr] pt-0 opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="max-w-[1200px] text-[15px] leading-7 text-[#6b7280] sm:text-[17px] sm:leading-8">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            <section className="w-full bg-white py-8 lg:py-6">
                <div className="px-4 md:px-6 lg:px-8">
                    <h2 className="text-center text-2xl font-bold leading-tight text-black md:text-2xl lg:text-3xl">
                        Featured In
                    </h2>

                    <div
                        className="relative mt-4 lg:mt-3"
                        onMouseEnter={pauseAutoSlide}
                        onMouseLeave={resumeAutoSlide}
                    >


                        {/* Slider wrapper */}
                        <div className="overflow-hidden px-12 sm:px-16 lg:px-20" >
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                                }}
                            >
                                {pressLogos.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="flex shrink-0 items-center justify-center"
                                        style={{ width: `${100 / slidesToShow}%` }}
                                    >
                                        <div className="flex h-[90px] w-full items-center justify-center md:h-[110px]">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="max-h-[35px] w-auto max-w-[150px] object-contain md:max-h-[30px] md:max-w-[200px]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="w-full bg-white py-8 sm:py-10 lg:py-1">
                <div className="px-4 sm:px-6 lg:px-3">
                    <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                        {/* Top thumbnails + actions */}
                        <div className="px-4 md:px-5 py-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={openReviewForm}
                                        className="inline-flex items-center gap-2 rounded-full border border-[#8b3dff] px-3 py-2 text-sm font-medium text-[#8b3dff] cursor-pointer">
                                        Write a review
                                    </button>

                                    <button
                                        onClick={openQuestionForm}
                                        className="inline-flex items-center gap-2 rounded-full border border-[#8b3dff] px-3 py-2 text-sm font-medium text-[#8b3dff] cursor-pointer">
                                        Ask a question
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Tabs */}
                        <div className="border-b border-[#e5e7eb] px-4 sm:px-8">
                            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("reviews")}
                                    className={`relative py-4 text-sm font-normal md:text-sm cursor-pointer ${activeTab === "reviews"
                                        ? "text-[#111827]"
                                        : "text-[#111827]"
                                        }`}
                                >
                                    Reviews ({reviewCount})
                                    {activeTab === "reviews" && (
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#111827]" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab("questions")}
                                    className={`relative whitespace-nowrap py-4 text-[20px] font-normal transition sm:text-[22px] cursor-pointer ${activeTab === "questions"
                                        ? "text-[#111827]"
                                        : "text-[#111827]"
                                        }`}
                                >
                                    Questions ({questionCount})
                                    {activeTab === "questions" && (
                                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#111827]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Reviews Tab */}
                        {activeTab === "reviews" && (
                            <div className="divide-y divide-[#e5e7eb]">
                                {showReviewForm && (
                                    <div className="px-4 py-5 sm:px-4 sm:py-6 bg-white">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium">Rating</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button key={s} onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))} className={`text-[#8b3dff] ${reviewForm.rating >= s ? 'opacity-100' : 'opacity-40'}`}>
                                                            <Star className="h-5 w-5 cursor-pointer" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <input
                                                value={reviewForm.title}
                                                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Review Title"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />

                                            <textarea
                                                value={reviewForm.content}
                                                onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                                                placeholder="Start writing here..."
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 h-32"
                                            />

                                            <input
                                                value={reviewForm.name}
                                                onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Display name"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            />

                                            <input
                                                value={reviewForm.email}
                                                onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                                                placeholder="Your email address"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            />

                                            <div className="flex items-center gap-3 py-3">
                                                <button onClick={handleSubmitReview} className="rounded-lg border border-[#8b3dff] px-4 py-2 text-[#8b3dff]">Submit Review</button>
                                                <button onClick={() => setShowReviewForm(false)} className="text-sm text-gray-500">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {product.productReviews.map((review, index) => (
                                    <div
                                        key={review.id || index}
                                        className="px-4 py-5 sm:px-4 sm:py-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="relative shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7e7e7] text-md font-normal text-[#3b3b3b] sm:h-12 sm:w-12 sm:text-md">
                                                    {review.initial}
                                                </div>

                                                {review.verified && (
                                                    <div className="absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-[#111827] text-white">
                                                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {review.rating && (
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(5)].map((_, starIndex) => {
                                                                    const filled = starIndex < Math.floor(review.rating);
                                                                    return (
                                                                        <Star
                                                                            key={starIndex}
                                                                            className={`h-2 w-2 ${filled
                                                                                ? "fill-[#8b3dff] text-[#8b3dff]"
                                                                                : "text-[#8b3dff]"
                                                                                }`}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {review.verified && (
                                                            <span className="inline-flex items-center bg-[#1f2430] px-2 py-1 text-xs rounded-lg font-medium leading-none text-white">
                                                                Verified
                                                            </span>
                                                        )}
                                                        <span className="text-md font-normal text-[#2b2b2b] md:text-md">
                                                            {review.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                {review.title && (
                                                    <h3 className="text-sm font-semibold leading-snug text-[#111827] md:text-sm">
                                                        {review.title}
                                                    </h3>
                                                )}

                                                <p className="mt-1 text-sm leading-[1.7] text-[#343434] md:text-sm">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Questions Tab */}
                        {activeTab === "questions" && (
                            <div className="divide-y divide-[#e5e7eb]">
                                {showQuestionForm && (
                                    <div className="px-4 py-5 sm:px-4 sm:py-6 bg-white">
                                        <div className="space-y-3">
                                            <input
                                                value={questionForm.name}
                                                onChange={(e) => setQuestionForm(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Display name"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />

                                            <input
                                                value={questionForm.email}
                                                onChange={(e) => setQuestionForm(prev => ({ ...prev, email: e.target.value }))}
                                                placeholder="Your email address"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />

                                            <textarea
                                                value={questionForm.question}
                                                onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                                                placeholder="Write your question here"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 h-32"
                                            />

                                            <div className="flex items-center gap-3">
                                                <button onClick={handleSubmitQuestion} className="rounded-lg border border-[#8b3dff] px-4 py-2 text-[#8b3dff]">Submit Question</button>
                                                <button onClick={() => setShowQuestionForm(false)} className="text-sm text-gray-500">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {product.productQuestions.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="px-4 py-5 sm:px-4 sm:py-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7e7e7] text-md font-normal text-[#3b3b3b] sm:h-12 sm:w-12 sm:text-md">
                                                    {item.initial}
                                                </div>
                                            </div>

                                            {/* Question content */}
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-md font-normal text-[#2b2b2b] md:text-md">
                                                    {item.name}
                                                </h4>

                                                <p className="text-md leading-[1.7] text-[#343434] md:text-md">
                                                    <span className="font-normal">Question:</span> {item.question}
                                                </p>

                                                <div className="mt-5 border-l-[4px] border-[#d4d4d4] bg-[#f2f2f2] px-3 py-1 md:px-3">
                                                    <h5 className="text-md font-semibold text-[#2b2b2b] md:text-md">
                                                        Clinikally
                                                    </h5>
                                                    <p className="mt-1 text-sm leading-[1.7] text-[#343434] md:text-sm">
                                                        <span className="font-normal">Answer:</span> {item.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>


            <section className="w-full bg-[#f3f4f6] py-8 mt-4">
                <div className="px-4 md:px-6 ">
                    <h2 className="text-center text-xl font-semibold text-black md:text-2xl">
                        Currently Trending:
                    </h2>

                    {/* Desktop / Tablet */}
                    <div className="mt-6 hidden md:grid md:grid-cols-5 md:gap-5 lg:gap-6">
                        {(product.trendingProducts || []).slice(0, 5).map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex h-[160px] items-center justify-center overflow-hidden rounded-lg bg-white">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-[130px] w-auto object-contain"
                                    />
                                </div>

                                <h3 className="min-h-[40px] text-md font-normal text-black">
                                    {item.name}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, index) => {
                                            const filled = index < Math.floor(item.rating || 4);
                                            return (
                                                <Star
                                                    key={index}
                                                    className={`h-4 w-5 ${filled
                                                        ? "fill-[#f4b400] text-[#f4b400]"
                                                        : "fill-[#e5e7eb] text-[#e5e7eb]"
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>

                                    <span className="text-xs text-[#6b7280]">
                                        ( {item.reviews} Reviews )
                                    </span>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span className="text-[18px] font-bold text-[#0a8f08]">
                                        ₹ {item.price}
                                    </span>

                                    {item.oldPrice && (
                                        <span className="text-[16px] font-semibold text-[#b9bec8] line-through">
                                            ₹ {item.oldPrice}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        image: item.gallery?.[0] || item.image,
                                    })}
                                    className="w-full rounded-lg border border-[#8b3dff] px-3 py-2 text-md font-semibold text-[#8b3dff] cursor-pointer">
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Slider */}
                    <div className="relative mt-6 md:hidden">
                        <div
                            ref={sliderRef}
                            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
                        >
                            {(product.trendingProducts || []).map((item) => (
                                <div
                                    key={item.id}
                                    className="min-w-[50%] snap-center rounded-lg bg-white px-3"
                                >
                                    <div className="flex mt-2 h-[90px] items-center justify-center overflow-hidden rounded-[14px]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-[110px] w-auto object-contain"
                                        />
                                    </div>

                                    <h3 className="mt-2 min-h-[50px] text-md font-semibold  text-black">
                                        {item.name}
                                    </h3>

                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, index) => {
                                                const filled = index < Math.floor(item.rating || 4);
                                                return (
                                                    <Star
                                                        key={index}
                                                        className={`h-4 w-4 ${filled
                                                            ? "fill-[#f4b400] text-[#f4b400]"
                                                            : "fill-[#e5e7eb] text-[#e5e7eb]"
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </div>

                                        <span className="text-sm text-[#6b7280]">
                                            ({item.reviews})
                                        </span>
                                    </div>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className="text-md font-bold text-[#0a8f08]">
                                            ₹ {item.price}
                                        </span>

                                        {item.oldPrice && (
                                            <span className="text-md font-semibold text-[#b9bec8] line-through">
                                                ₹ {item.oldPrice}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => addToCart({
                                            id: item.id,
                                            name: item.name,
                                            price: item.price,
                                            image: item.gallery?.[0] || item.image,
                                        })}
                                        className="mt-1 w-full rounded-lg border border-[#8b3dff] px-4 py-2.5 text-[16px] font-semibold text-[#8b3dff] transition hover:bg-[#faf5ff]">
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            <section className="w-full bg-[#f3f4f6] py-10 sm:py-12 lg:py-8">
                <div className="px-4 md:px-6 ">
                    <h2 className="text-center text-xl font-semibold text-black md:text-2xl">
                        Similar products purchased recently:
                    </h2>

                    {/* Desktop / Tablet */}
                    <div className="mt-6 hidden md:grid md:grid-cols-5 md:gap-5 lg:gap-6">
                        {(product.similarProducts || []).slice(0, 5).map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex h-[160px] items-center justify-center overflow-hidden rounded-lg bg-white">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-[130px] w-auto object-contain"
                                    />
                                </div>

                                <h3 className="min-h-[40px] text-md font-normal text-black">
                                    {item.name}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, index) => {
                                            const filled = index < Math.floor(item.rating || 4);
                                            return (
                                                <Star
                                                    key={index}
                                                    className={`h-4 w-5 ${filled
                                                        ? "fill-[#f4b400] text-[#f4b400]"
                                                        : "fill-[#e5e7eb] text-[#e5e7eb]"
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>

                                    <span className="text-xs text-[#6b7280]">
                                        ( {item.reviews} Reviews )
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="text-[18px] font-bold text-[#0a8f08]">
                                        ₹ {item.price}
                                    </span>

                                    {item.oldPrice && (
                                        <span className="text-[16px] font-semibold text-[#b9bec8] line-through">
                                            ₹ {item.oldPrice}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        image: item.gallery?.[0] || item.image,
                                    })}
                                    className="mt-1 cursor-pointer w-full rounded-lg border border-[#8b3dff] px-3 py-2 text-md font-semibold text-[#8b3dff]">
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Slider */}
                    <div className="relative mt-6 md:hidden">
                        <div
                            ref={sliderRef}
                            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
                        >
                            {(product.similarProducts || []).map((item) => (
                                <div
                                    key={item.id}
                                    className="min-w-[50%] snap-center rounded-lg bg-white p-3"
                                >
                                    <div className="flex h-[90px] items-center justify-center overflow-hidden rounded-[14px]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-[110px] w-auto object-contain"
                                        />
                                    </div>

                                    <h3 className="mt-3 min-h-[50px] text-md font-semibold  text-black">
                                        {item.name}
                                    </h3>

                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, index) => {
                                                const filled = index < Math.floor(item.rating || 4);
                                                return (
                                                    <Star
                                                        key={index}
                                                        className={`h-4 w-4 ${filled
                                                            ? "fill-[#f4b400] text-[#f4b400]"
                                                            : "fill-[#e5e7eb] text-[#e5e7eb]"
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </div>

                                        <span className="text-sm text-[#6b7280]">
                                            ({item.reviews})
                                        </span>
                                    </div>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className="text-md font-bold text-[#0a8f08]">
                                            ₹ {item.price}
                                        </span>

                                        {item.oldPrice && (
                                            <span className="text-md font-semibold text-[#b9bec8] line-through">
                                                ₹ {item.oldPrice}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="mt-3 w-full rounded-lg border border-[#8b3dff] px-4 py-2.5 text-[16px] font-semibold text-[#8b3dff] transition hover:bg-[#faf5ff]">
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            <section className="w-full py-4">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {product.features.map((item, index) => (
                            <div
                                key={item.id}
                                className={`
                flex items-center gap-3 md:gap-4 px-2 md:px-3 py-3 md:py-2 border border-gray-300 rounded-lg
                ${index !== product.features.length - 1}
              `}
                            >
                                <div className="shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-10 w-10 sm:w-16 md:h-16 md:w-20 object-contain"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-sm sm:text-base md:text-[18px] font-semibold text-[#222] leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm md:text-[15px] text-[#8d93a6] leading-tight">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>



    );
}

function ChevronDownSmall() {
    return (
        <svg
            className="h-4 w-4 text-[#6b7280]"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default Details;