import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './messages.css';
import List from './ChatComponents/list/List';
import Chat from './ChatComponents/chat/Chat';
import Detail from './ChatComponents/detail/Detail';

const Messages = () => {
    return (
        <div className='messages-page'>
        <div className='messages-body'>
                <List />
                <Chat />
                <Detail />
        </div>
        </div>
    )
}

export default Messages;