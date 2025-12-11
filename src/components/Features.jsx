import React from 'react';

const Features = () => {
    return (
        <section className="section-features">
            <div className="container">

                {/* Feature 1 */}
                <div className="grid-split" style={{ marginBottom: '120px' }}>
                    <div>
                        <img
                            src="/feature-schedule.png"
                            alt="Vadea Editor with /schedule command"
                            style={{ borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                        />
                    </div>
                    <div>
                        <h2 className="mb-2">Don't just take notes. Act on them.</h2>
                        <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: 1.6 }}>
                            Type <code>/schedule</code> to instantly turn a thought into a plan. Vadea understands your context and blocks time for you automatically.
                        </p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="grid-split">
                    <div style={{ order: 2 }}> {/* Image Right */}
                        <img
                            src="/feature-chat.png"
                            alt="Vadea AI Chat summarizing PDF"
                            style={{ borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                        />
                    </div>
                    <div style={{ order: 1 }}> {/* Text Left */}
                        <h2 className="mb-2">Turn your textbooks into a conversation.</h2>
                        <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: 1.6 }}>
                            Upload any PDF and start chatting. Get summaries, quiz yourself, or find that one specific citation in seconds.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Features;
