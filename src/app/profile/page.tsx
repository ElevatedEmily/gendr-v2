'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [name, setName] = useState(''); // Add state for name
  const [age, setAge] = useState<number | ''>(''); // Age state
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile || { images: [] });
          setName(data.profile?.name || ''); // Load name from profile
          setBio(data.profile?.bio || '');
          setAge(data.profile?.age || '');
        } else if (res.status === 401) {
          router.push('/login');
        } else {
          throw new Error(`Failed to fetch profile: ${res.statusText}`);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSaveChanges = async () => {
    try {
      if (age < 18) {
        setError('Age must be 18 or above.');
        return;
      }

      setIsSaving(true);

      const formData = new FormData();
      formData.append('name', name); // Include name in form data
      formData.append('bio', bio);
      formData.append('age', age.toString());

      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      galleryImages.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });

      imagesToDelete.forEach((id) => {
        formData.append('imagesToDelete', id.toString());
      });

      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prevProfile) => ({
          ...prevProfile,
          name: data.profile.name,
          bio: data.profile.bio,
          age: data.profile.age,
          images: data.profile.images,
        }));
        setEditing(false);
        setProfilePic(null);
        setGalleryImages([]);
        setImagePreviews([]);
        setImagesToDelete([]);
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };
  

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setGalleryImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageNavigation = (direction: 'left' | 'right') => {
    if (!profile?.images || profile.images.length === 0) return;

    const totalImages = profile.images.length;
    if (direction === 'left') {
      setCurrentImageIndex((currentImageIndex - 1 + totalImages) % totalImages);
    } else {
      setCurrentImageIndex((currentImageIndex + 1) % totalImages);
    }
  };

  const handleDeleteImage = (id: number) => {
    // Add image ID to the list of images to delete
    setImagesToDelete((prev) => [...prev, id]);

    // Immediately remove the image from the profile.images state
    setProfile((prevProfile) => ({
      ...prevProfile,
      images: prevProfile.images.filter((image: any) => image.id !== id),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <p className="text-gray-800 dark:text-gray-100">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <p className="text-gray-800 dark:text-gray-100">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <p className="text-gray-800 dark:text-gray-100">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={profile.avatarUrl || '/default-avatar.png'}
              alt="Profile Picture"
              className="w-full h-full rounded-full object-cover border border-pink-500 shadow-md"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                  className="hidden"
                />
                📷
              </label>
            )}
          </div>
          <h1 className="text-3xl font-bold mt-4">{profile.name}</h1>
        </div>
         {/* Name Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Name</h2>
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your name"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">{name || 'No name provided'}</p>
          )}
        </div>
        {/* Age Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Age</h2>
          {editing ? (
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10) || '')}
              className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your age (must be 18+)"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">{age || 'Age not set'}</p>
          )}
        </div>

        {/* Bio Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Bio</h2>
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-300 focus:outline-none"
              rows={4}
            ></textarea>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">{bio || 'No bio available.'}</p>
          )}
        </div>

        {/* Gallery Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
          {profile.images && profile.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.images.map((img: any) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt={`Gallery Image ${img.id}`}
                    className="w-full h-[250px] object-cover rounded-lg"
                  />
                  {editing && (
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No images available.</p>
          )}
          {editing && (
            <div className="mt-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
                className="block w-full text-gray-700 dark:text-gray-300"
              />
              <div className="mt-4 flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-[100px] h-[150px] object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save / Edit Buttons */}
        {editing ? (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
