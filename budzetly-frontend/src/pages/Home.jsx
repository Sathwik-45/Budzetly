import foodImage from "../assets/budzetly-food.png";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar";
function Home() {
    return (
        <><Navbar/>
          <main className="home">

            <section className="hero">

                <div className="hero-content">
                    <h1>Good Things. </h1>
                       <h1> Better Prices.</h1>

                    <p>
                        Discover great deals near you and save more
                        on things you already love.
                    </p>

                   <Link to="/login"><button>Explore Deals</button></Link>
                </div>

                <div className="hero-image">
                    <img src={foodImage} alt="Budzetly food deals" />
                </div>

            </section>


            <section className="categories">

                <h2>Explore Categories</h2>

                <div className="category-list">
                    <Link to="/login"><div > Food</div></Link>
                    <Link to="/login"><div> Bakery</div></Link>
                    <Link to="/login"><div> Café</div></Link>
                    <Link to="/login"><div> Stores</div></Link>
                </div>

            </section>

        </main>
        </>
      
    );
}

export default Home;