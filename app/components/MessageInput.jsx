import React, { useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-hot-toast';

function MessageInput({ sendMessage, message, setMessage,image,setImage }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 

  const storage = getStorage(app);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setFile(null);
          setImage(downloadURL);
          setImagePreview(null);
          document.getElementById('my_modal_3').close()
        });
      }
    );
  };

  const handleEmojiClick = (emojiData, event) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className='relative flex items-center p-4 border-t border-gray-200'>
      <FaPaperclip
        onClick={() => document.getElementById('my_modal_3').showModal()}
        className={`${image ? "text-blue-500":"text-gray-500"} mr-2 cursor-pointer`}
      />
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        😊
      </button>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type='text'
        placeholder='Type a message...'
        className='flex-1 border-none p-2 outline-none'
      />

      <FaPaperPlane onClick={() => sendMessage()} className='text-blue-500 cursor-pointer ml-2' />

      {showEmojiPicker && (
        <div className='absolute right-0 bottom-full p-2'>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            disableAutoFocus={true}
          />
        </div>
      )}

      <dialog id='my_modal_3' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            {imagePreview && <img src={imagePreview} alt='Uploaded' className='max-h-60 w-60 mb-4' />}
            <input type='file' accept='image/*' onChange={handleFileChange} />
            <div onClick={()=>{handleUpload()}} className='btn btn-sm btn-primary'>
              Upload
            </div>
            <progress value={uploadProgress} max='100'></progress>
          </form>
          <button
            onClick={() => document.getElementById('my_modal_3').close()}
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
          >
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default MessageInput;