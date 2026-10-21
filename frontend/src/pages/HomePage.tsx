import Header from '../components/layout/Header'
import "../styles/HomePage.css"

export default function HomePage() {
    return (
        <>
        <section className="hero">
            <Header />
            <div className="hero-content">
                <span>Een helder beeld van<br/>je volgende auto.</span>
                <p>Vul een kenteken in en ontdek wat je wilt weten<br/>voordat je koopt.</p>
            </div>
        </section>
        </>
    )
}