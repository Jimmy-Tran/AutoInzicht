import "../../styles/Header.css"

export default function Header() {
  return (
    <div className="header-container">
        <span>AutoInzicht</span>
        <div className="header-links">
            <a href="/">Kenteken Check</a>
            <a href="/about">KM Check (soon)</a>
            <a href="/contact">Schade Check (soon)</a>
        </div>
        <a href="/login" className="header-link__login">Inloggen</a>
    </div>
  )
}