import React, { useState } from 'react';
import './Write.css';

const Write = ({
    onPost = (contents) => { console.error('post function not defined'); }
}) => {
    const [contents, setContents] = useState('');
    const handleChange = (e) => {
        setContents(e.target.value);
    }
    const handlePost = () => {
        let contents = contents;
        
        onPost(contents).then(() => {
            setContents("");
        });
    }
    return (
        <div className="container write">
            <div className="card">
                <div className="card-content">
                    <textarea
                        className="materialize-textarea"
                        placeholder="Write down your memo"
                        value={contents}
                        onChange={handleChange}></textarea>
                </div>
                <div className="card-action">
                    <a onClick={handlePost}>POST</a>
                </div>
            </div>
        </div>
    );
};

export default Write;