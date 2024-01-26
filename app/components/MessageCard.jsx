import React, { useState } from 'react';
import moment from 'moment';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { BiDotsVertical } from 'react-icons/bi';
import { toast } from 'react-hot-toast';

function MessageCard({ message, me, other }) {
  const [showMenu, setShowMenu] = useState(false);
  const isMessageFromMe = message.sender === me.id;

  const formatTimeAgo = (timestamp) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const deleteMessage = async (messageId) => {
    try {
      await updateDoc(doc(firestore, 'messages', messageId), { deleted: true });
      toast.success('Message deleted successfully');
      setShowMenu(false); 
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div key={message.id} className={`flex mb-4 ${isMessageFromMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`mr-2 ${isMessageFromMe ? 'cursor-pointer' : ''}`} onClick={toggleMenu}>
        <BiDotsVertical size={20} color="#555" />
        {showMenu && isMessageFromMe && (
          <div className="absolute bg-white p-2 rounded shadow mt-1">
            <button  onClick={() => deleteMessage(message.id)} className="btn btn-error cursor-pointer">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className={`w-10 h-10 ${isMessageFromMe ? 'ml-2 mr-2' : 'mr-2'}`}>
        {isMessageFromMe && (
          <img
            className='w-full h-full object-cover rounded-full'
            src={me.avatarUrl}
            alt='Avatar'
          />
        )}
        {!isMessageFromMe && (
          <img
            className='w-full h-full object-cover rounded-full'
            src={other.avatarUrl}
            alt='Avatar'
          />
        )}
      </div>

      <div className={` text-white p-2 rounded-md ${isMessageFromMe ? 'bg-blue-500 self-end' : 'bg-[#19D39E] self-start'}`}>
        {message.deleted ? (
          <p>This message was deleted</p>
        ) : (
          <>
            {message.image && <img src={message.image} className='max-h-60 w-60 mb-4' />}
            <p>{message.content}</p>
            <div className='text-xs text-gray-200'>{formatTimeAgo(message.time)}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default MessageCard;
