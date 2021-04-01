import { fetch } from './csrf';

const imageUploader = async (image) => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });

    console.log(response);

    return response.data;
};

export default imageUploader;
