import './loading.scss'
const Loading = () => {
    return (
        <div id="loading">
            <div className='themed-root flex flex-col justify-center items-center w-1/5'>
                <div className="spinner"></div>
                <br />
                <div className="is-loading-text">
                    <span className="is-loading-letter">L</span>
                    <span className="is-loading-letter">o</span>
                    <span className="is-loading-letter">a</span>
                    <span className="is-loading-letter">d</span>
                    <span className="is-loading-letter">i</span>
                    <span className="is-loading-letter">n</span>
                    <span className="is-loading-letter">g</span>
                    <span className="is-loading-letter">.</span>
                    <span className="is-loading-letter">.</span>
                    <span className="is-loading-letter">.</span>
                </div>
            </div>
        </div>
    );
}

export default Loading;