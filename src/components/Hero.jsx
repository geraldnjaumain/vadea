import React from 'react';

const Hero = () => {
    return (
        <section className="section-hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="container grid-split">

                {/* Text Content */}
                <div>
                    <h1 className="mb-2">Your Entire School Life. One Tab.</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '32px', color: '#4b5563' }}>
                        AI notes, scheduling, and resources integrated.
                    </p>
                    <a href="#" className="btn btn-primary">Get Vadea Free</a>
                </div>

                {/* Image Content */}
                <div>
                    <img
                        src="/hero-image.png"
                        alt="Vadea App Interface with AI notes and scheduling"
                        style={{ borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    />
                </div>

            </div>
        </section>
    );
};

export default Hero;
