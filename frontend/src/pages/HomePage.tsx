import Header from '../components/layout/Header'
import "../styles/HomePage.css"
import PlateSearchForm from '../components/vehicle/PlateSearchForm'
import TrustBar from '../components/home/TrustBar'

export default function HomePage() {
    return (
        <>
        <section className="hero">
            <Header />
            <div className="hero-content">
                <div className="hero-text">
                    <span>Een helder beeld van<br/>je volgende auto.</span>
                    <p>Vul een kenteken in en ontdek wat je wilt weten<br/>voordat je koopt.</p>
                    <PlateSearchForm />
                </div>
                <div className="hero-image">
                    <img src="../../images/vw-golf.jpeg" alt="AutoInzicht" />
                </div>
            </div>
            <TrustBar />
        </section>
        </>
    )
}