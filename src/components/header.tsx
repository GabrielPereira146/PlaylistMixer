import spotifyIcon from "../assets/spotify-white-icon.svg";

export default function Header() {
    return (
        <div className="bg-black w-full h-16 flex items-center px-4">
            <a href="https://open.spotify.com/" target="_self" rel="noopener">
                <img src={spotifyIcon} className="size-8 ml-3 hover:cursor-pointer select-none" alt="spotify-white-icon" />
            </a>
        </div>
    );
}