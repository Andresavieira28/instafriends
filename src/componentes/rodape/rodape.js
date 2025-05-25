import './rodape.css';

const Rodape = () => {
    return (
        <footer className="footer">
            <div className="social">
                <a href="https://github.com/Andresavieira28" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .5A12 12 0 0 0 0 12.6a12 12 0 0 0 8.2 11.5c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6a3.2 3.2 0 0 0-1.3-1.8c-1.1-.8.1-.8.1-.8a2.6 2.6 0 0 1 1.9 1.3 2.7 2.7 0 0 0 3.6 1.1c.1-1 .4-1.7.8-2.1-2.6-.3-5.3-1.3-5.3-6A4.8 4.8 0 0 1 6.4 7a4.4 4.4 0 0 1 .1-3.2s1-.3 3.2 1.2a10.8 10.8 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2a4.4 4.4 0 0 1 .1 3.2 4.8 4.8 0 0 1 1.2 3.3c0 4.7-2.7 5.7-5.3 6a3 3 0 0 1 .9 2.3v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12.6 12 12 0 0 0 12 .5Z"/>
                    </svg>
                </a>
                <a href="https://www.linkedin.com/in/andresa-vieira/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM7 19H4v-9h3v9zm-1.5-10.3c-1 0-1.8-.8-1.8-1.7 0-1 .8-1.7 1.8-1.7s1.8.7 1.8 1.7c0 1-.8 1.7-1.8 1.7zM20 19h-3v-4.8c0-1.2-.5-2-1.7-2-1 0-1.6.7-1.9 1.4-.1.2-.1.5-.1.8V19h-3v-9h3v1.3c.4-.6 1.3-1.5 3-1.5 2.1 0 3.7 1.3 3.7 4V19z"/>
                    </svg>
                </a>
                <a href="mailto:andresavieira28@gmail.com" aria-label="Email">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 13.5 0 6V4l12 7.5L24 4v2l-12 7.5Zm0 2.3L0 8.3V20h24V8.3L12 15.8Z"/>
                    </svg>
                </a>
            </div>

            <div className="logo">I N S T A F R I E N D S</div>

            <div className="credit">
                <p>
                    Desenvolvido por <a href="https://www.linkedin.com/in/andresa-vieira/">Andresa Vieira</a>
                </p>
            </div>
        </footer>
    );
};

export default Rodape;