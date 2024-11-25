export async function uploadFileToCloudinary(file: Blob) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary preset
  
    const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error('Failed to upload file');
    }
  
    return res.json();
  }
  