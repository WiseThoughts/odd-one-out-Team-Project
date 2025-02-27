import React, { useEffect } from 'react';
import './background.css';


const Background = () => {
    useEffect(() => {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const numLetters = 100; //adjust for more or less letters
        const container = document.getElementById("background-container");
        if (!container) return;
        container.innerHTML = "";
        for (let i = 0; i < numLetters; i++) {
            let span = document.createElement("span");
            span.className = "letter";
            span.innerText = letters[Math.floor(Math.random() * letters.length)];
            span.style.left = Math.random() * 100 + "vw";
            span.style.top = Math.random() * 100 + "vh";
            span.style.animationDuration = Math.random() * 10 + 10 + "s"; //adjust speeds
            container.appendChild(span);
        }
    },[]);
    return <div id="background-container"></div>;
};

export default Background;