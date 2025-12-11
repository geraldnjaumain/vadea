import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/Legal.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <h1>Privacy Policy</h1>
                <p className="last-updated">Last updated: December 11, 2024</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Vadea ("we," "our," or "us"). We are committed to protecting your privacy
                        and ensuring the security of your personal information. This Privacy Policy explains
                        how we collect, use, disclose, and safeguard your information when you use our
                        productivity application.
                    </p>
                </section>

                <section>
                    <h2>2. Information We Collect</h2>
                    <h3>2.1 Information You Provide</h3>
                    <ul>
                        <li><strong>Account Information:</strong> Email address, name, and password when you create an account</li>
                        <li><strong>Profile Information:</strong> Profile picture and display name</li>
                        <li><strong>Content:</strong> Notes, schedules, events, and files you upload to the Vault</li>
                    </ul>

                    <h3>2.2 Information Collected Automatically</h3>
                    <ul>
                        <li><strong>Usage Data:</strong> How you interact with our application</li>
                        <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
                        <li><strong>Log Data:</strong> IP address, access times, and pages viewed</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process and manage your account</li>
                        <li>Enable AI-powered features like Study Buddy and smart organization</li>
                        <li>Send you updates, security alerts, and support messages</li>
                        <li>Analyze usage patterns to enhance user experience</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Storage and Security</h2>
                    <p>
                        Your data is stored securely using Supabase, a trusted cloud infrastructure provider.
                        We implement industry-standard security measures including:
                    </p>
                    <ul>
                        <li>Encryption in transit (HTTPS/TLS)</li>
                        <li>Encryption at rest for stored data</li>
                        <li>Row-level security policies for data isolation</li>
                        <li>Regular security audits and updates</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Data Sharing</h2>
                    <p>
                        We do not sell, trade, or rent your personal information to third parties.
                        We may share data only in the following circumstances:
                    </p>
                    <ul>
                        <li>With your explicit consent</li>
                        <li>To comply with legal obligations</li>
                        <li>To protect our rights and prevent fraud</li>
                        <li>With service providers who assist in operating our application (under strict confidentiality agreements)</li>
                    </ul>
                </section>

                <section>
                    <h2>6. AI Features</h2>
                    <p>
                        Our AI Study Buddy feature processes your uploaded content to provide personalized
                        learning assistance. This processing:
                    </p>
                    <ul>
                        <li>Is performed to enhance your study experience</li>
                        <li>Does not share your content with third parties</li>
                        <li>Uses embeddings stored securely in your account</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Export your data in a portable format</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt out of non-essential communications</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Cookies and Tracking</h2>
                    <p>
                        We use essential cookies to maintain your session and preferences.
                        We do not use third-party tracking cookies for advertising purposes.
                    </p>
                </section>

                <section>
                    <h2>9. Children's Privacy</h2>
                    <p>
                        Vadea is not intended for users under 13 years of age. We do not knowingly
                        collect personal information from children under 13.
                    </p>
                </section>

                <section>
                    <h2>10. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of
                        any changes by posting the new policy on this page and updating the "Last updated" date.
                    </p>
                </section>

                <section>
                    <h2>11. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy or our practices, please contact us at:
                    </p>
                    <p className="contact-email">support@vadea.app</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
