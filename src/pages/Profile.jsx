import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</p>
          <p className="text-lg font-medium">{user?.full_name || '-'}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email</p>
          <p className="text-lg font-medium">{user?.email || '-'}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
