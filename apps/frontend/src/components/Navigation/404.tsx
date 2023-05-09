import React from 'react';
import './PageNotFound.css';
import image404 from '../../images/0_0.png';

interface PageNotFoundProps {
  onBackClick?: () => void;
}

const PageNotFound: React.FC<PageNotFoundProps> = ({ onBackClick }) => (
  <section className="PageNotFound">
    <img src={image404} alt="Illustration" />
    <div>
      <h1>404 !</h1>
      <span>Page not found</span>
      <p>Oups ! On dirait que cette page est en échec et mat. Retournez à la case départ en cliquant ici.</p>
      <button onClick={onBackClick}>Back to home page</button>
    </div>
  </section>
);

export default PageNotFound;
