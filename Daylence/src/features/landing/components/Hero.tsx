import React from "react";
import "../css/LandingPage.css";

export default function Hero() {
  return (
    <section className="landing-hero-div">
      <div className="landing-hero__content"></div>
      <div className="landing-pricing-container"></div>
      <div className="landing-widgets-container"></div>
      <div className="landing-hero-div-buttons">
        <div>
          <button className="btn-recipe-custom group">
            <span className="btn-recipe-bg-hover"></span>

            <span className="btn-recipe-svg-left">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="btn-recipe-svg-right">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>

            <span className="btn-recipe-overlay"></span>

            <span className="btn-recipe-text">Recettes & Cuisine</span>
          </button>
        </div>
        <div>
          <button className="btn-sleep-custom group">
            <span className="btn-sleep-bg-hover"></span>

            <span className="btn-sleep-svg-left">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="btn-sleep-svg-right">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>

            <span className="btn-sleep-overlay"></span>

            <span className="btn-sleep-text">Sommeil & Analyse</span>
          </button>
        </div>
        <div>
          <button className="btn-transport-custom group">
            <span className="btn-transport-bg-hover"></span>

            <span className="btn-transport-svg-left">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="btn-transport-svg-right">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>

            <span className="btn-transport-overlay"></span>

            <span className="btn-transport-text">Transport</span>
          </button>
        </div>
        <div>
          <button className="btn-budget-custom group">
            <span className="btn-budget-bg-hover"></span>

            <span className="btn-budget-svg-left">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="btn-budget-svg-right">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>

            <span className="btn-budget-overlay"></span>

            <span className="btn-budget-text">Budget</span>
          </button>
        </div>
        <div>
<button className="btn-work-custom group">
            <span className="btn-work-bg-hover"></span>

            <span className="btn-work-svg-left">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="btn-work-svg-right">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>

            <span className="btn-work-overlay"></span>

            <span className="btn-work-text">Travail</span>
          </button>        </div>
        <div>
<button className="btn-todolist-custom group">
            <span className="btn-todolist-bg-hover"></span>

            <span className="btn-todolist-svg-left">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="btn-todolist-svg-right">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>

            <span className="btn-todolist-overlay"></span>

            <span className="btn-todolist-text">To do List</span>
          </button>        </div>
        <div>
         <button className="btn-appblock-custom group">
            <span className="btn-appblock-bg-hover"></span>

            <span className="btn-appblock-svg-left">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span className="btn-appblock-svg-right">
              <svg viewBox="0 0 487 487">
                <path
                  fill="currentColor"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>

            <span className="btn-appblock-overlay"></span>

            <span className="btn-appblock-text">Blockeur d'Application</span>
          </button>
        </div>
      </div>
    </section>
  );
}
