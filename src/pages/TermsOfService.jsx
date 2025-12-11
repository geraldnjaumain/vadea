import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/Legal.css';

const TermsOfService = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <h1>Terms of Service</h1>
                <p className="last-updated">Last updated: December 11, 2024</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Vadea ("the Service"), you agree to be bound by these
                        Terms of Service ("Terms"). If you do not agree to these Terms, please do not
                        use the Service.
                    </p>
                </section>

                <section>
                    <h2>2. Description of Service</h2>
                    <p>
                        Vadea is a productivity application designed for students, providing features including:
                    </p>
                    <ul>
                        <li>Note-taking and organization</li>
                        <li>Schedule and event management</li>
                        <li>File storage and organization (Vault)</li>
                        <li>AI-powered study assistance</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Account Registration</h2>
                    <p>To use certain features, you must create an account. You agree to:</p>
                    <ul>
                        <li>Provide accurate and complete registration information</li>
                        <li>Maintain the security of your password</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                </section>

                <section>
                    <h2>4. User Content</h2>
                    <h3>4.1 Ownership</h3>
                    <p>
                        You retain ownership of all content you create or upload to Vadea, including
                        notes, files, and schedules ("User Content").
                    </p>

                    <h3>4.2 License</h3>
                    <p>
                        By uploading User Content, you grant us a limited license to store, process,
                        and display your content solely for the purpose of providing the Service to you.
                    </p>

                    <h3>4.3 Prohibited Content</h3>
                    <p>You agree not to upload content that:</p>
                    <ul>
                        <li>Infringes on intellectual property rights</li>
                        <li>Contains malware or harmful code</li>
                        <li>Is illegal, defamatory, or offensive</li>
                        <li>Violates the privacy of others</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Acceptable Use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use the Service for any illegal purpose</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Interfere with or disrupt the Service</li>
                        <li>Reverse engineer or decompile any part of the Service</li>
                        <li>Use automated systems to access the Service without permission</li>
                        <li>Share your account credentials with others</li>
                    </ul>
                </section>

                <section>
                    <h2>6. AI Features</h2>
                    <p>
                        The AI Study Buddy feature is provided "as is" for educational assistance.
                        You acknowledge that:
                    </p>
                    <ul>
                        <li>AI-generated responses may not always be accurate</li>
                        <li>AI features should supplement, not replace, your own learning</li>
                        <li>You are responsible for verifying AI-provided information</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Payment and Subscriptions</h2>
                    <p>
                        Certain features may require a paid subscription. If applicable:
                    </p>
                    <ul>
                        <li>Payments are processed securely through third-party providers</li>
                        <li>Subscriptions auto-renew unless cancelled</li>
                        <li>Refunds are subject to our refund policy</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Intellectual Property</h2>
                    <p>
                        The Vadea name, logo, design, and all related intellectual property are owned
                        by us. You may not use our branding without written permission.
                    </p>
                </section>

                <section>
                    <h2>9. Disclaimer of Warranties</h2>
                    <p>
                        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT
                        GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                    </p>
                </section>

                <section>
                    <h2>10. Limitation of Liability</h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY
                        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
                        FROM YOUR USE OF THE SERVICE.
                    </p>
                </section>

                <section>
                    <h2>11. Account Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your account if you violate
                        these Terms. You may also delete your account at any time through the Settings page.
                    </p>
                </section>

                <section>
                    <h2>12. Changes to Terms</h2>
                    <p>
                        We may modify these Terms at any time. Continued use of the Service after
                        changes constitutes acceptance of the modified Terms.
                    </p>
                </section>

                <section>
                    <h2>13. Governing Law</h2>
                    <p>
                        These Terms are governed by the laws of the jurisdiction in which we operate,
                        without regard to conflict of law principles.
                    </p>
                </section>

                <section>
                    <h2>14. Contact</h2>
                    <p>
                        For questions about these Terms, please contact us at:
                    </p>
                    <p className="contact-email">legal@vadea.app</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
