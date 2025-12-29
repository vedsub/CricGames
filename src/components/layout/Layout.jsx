import Navbar from '../Navbar';
import Footer from './Footer';

/**
 * Layout - Page wrapper
 * - Navbar: 64px fixed height
 * - Main content: padded top by 64px (pt-16) to account for fixed navbar
 * - Footer at bottom
 */
function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
