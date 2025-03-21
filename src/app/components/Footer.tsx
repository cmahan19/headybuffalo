// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Company Info Section */}
        <div style={styles.column}>
          <h3>Heady Buffalo</h3>
          <p>Your one-stop shop for eco-friendly products</p>
        </div>

        {/* Quick Links Section */}
        <div style={styles.column}>
          <h3>Quick Links</h3>
          <ul style={styles.list}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div style={styles.column}>
          <h3>Follow Us</h3>
          <ul style={styles.socialList}>
            <li><a href="https://www.facebook.com/HeadyBuffalo" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com/HeadyBuffalo" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://www.instagram.com/HeadyBuffalo" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Heady Buffalo. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0 20px',
    flexWrap: 'wrap',
  },
  column: {
    flex: '1',
    margin: '10px',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  socialList: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  bottom: {
    textAlign: 'center',
    paddingTop: '20px',
    fontSize: '14px',
  }
};

export default Footer;
