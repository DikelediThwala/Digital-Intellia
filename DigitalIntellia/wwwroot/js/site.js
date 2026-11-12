console.log("Digital Intellia JavaScript is loaded!");
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // MOBILE NAVIGATION
    // =========================================

    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");

    if (menuToggle && siteNav) {

        menuToggle.addEventListener("click", function () {
            const isOpen = siteNav.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        document.querySelectorAll(".nav-link, .nav-contact").forEach(link => {
            link.addEventListener("click", function () {
                siteNav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    // =========================================
    // HEADER SCROLL EFFECT
    // =========================================

    const header = document.querySelector(".site-header");

    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 30);
        }
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();


    // =========================================
    // SCROLL REVEAL ANIMATIONS
    // =========================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

    }


    // =========================================
    // SERVICES CAROUSEL - INFINITE LOOP
    // =========================================

    const track = document.getElementById("servicesTrack");
    const previousButton = document.getElementById("servicesPrevious");
    const nextButton = document.getElementById("servicesNext");
    const carousel = document.querySelector(".services-carousel");

    if (track && previousButton && nextButton) {

        const originalCards = Array.from(
            track.querySelectorAll(".service-card")
        );

        let currentIndex = 0;
        let autoSlide;
        let isTransitioning = false;

        function getVisibleCards() {
            if (window.innerWidth <= 760) return 1;
            if (window.innerWidth <= 1050) return 2;
            return 3;
        }

        // Clone enough cards to create a continuous loop.
        function setupClones() {

            track.querySelectorAll(".carousel-clone").forEach(clone => {
                clone.remove();
            });

            const numberToClone = getVisibleCards();

            originalCards.slice(0, numberToClone).forEach(card => {

                const clone = card.cloneNode(true);
                clone.classList.add("carousel-clone");
                clone.setAttribute("aria-hidden", "true");

                track.appendChild(clone);

            });
        }

        setupClones();

        function getCardWidth() {
            return originalCards[0].getBoundingClientRect().width;
        }

        function getGap() {
            return parseFloat(getComputedStyle(track).columnGap) || 0;
        }

        function updateCarousel(animate = true) {

            const offset = Math.round(
                currentIndex * (getCardWidth() + getGap())
            );

            track.style.transition = animate
                ? "transform .75s cubic-bezier(.22, .8, .25, 1)"
                : "none";

            track.style.transform = `translateX(-${offset}px)`;

        }

        function finishTransition(callback) {

            let finished = false;

            function onTransitionEnd(event) {

                if (event.target !== track || finished) return;

                finished = true;
                track.removeEventListener("transitionend", onTransitionEnd);

                if (callback) callback();

            }

            track.addEventListener("transitionend", onTransitionEnd);

            // Fallback in case the transition event does not fire.
            setTimeout(() => {

                if (!finished) {
                    finished = true;
                    track.removeEventListener("transitionend", onTransitionEnd);

                    if (callback) callback();
                }

            }, 850);
        }

        function moveNext() {

            if (isTransitioning) return;

            isTransitioning = true;

            currentIndex++;
            updateCarousel(true);

            finishTransition(() => {

                if (currentIndex === originalCards.length) {
                    currentIndex = 0;
                    updateCarousel(false);
                }

                isTransitioning = false;

            });
        }

        function movePrevious() {

            if (isTransitioning) return;

            isTransitioning = true;

            if (currentIndex === 0) {

                currentIndex = originalCards.length;
                updateCarousel(false);

                // Allow the browser to apply the instant position.
                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        currentIndex--;
                        updateCarousel(true);

                        finishTransition(() => {
                            isTransitioning = false;
                        });

                    });

                });

            } else {

                currentIndex--;
                updateCarousel(true);

                finishTransition(() => {
                    isTransitioning = false;
                });

            }
        }

        function startAutoSlide() {

            clearInterval(autoSlide);

            autoSlide = setInterval(() => {
                moveNext();
            }, 5000);

        }

        nextButton.addEventListener("click", function () {
            moveNext();
            startAutoSlide();
        });

        previousButton.addEventListener("click", function () {
            movePrevious();
            startAutoSlide();
        });

        if (carousel) {

            carousel.addEventListener("mouseenter", () => {
                clearInterval(autoSlide);
            });

            carousel.addEventListener("mouseleave", () => {
                startAutoSlide();
            });

            carousel.addEventListener("focusin", () => {
                clearInterval(autoSlide);
            });

            carousel.addEventListener("focusout", () => {
                startAutoSlide();
            });

        }

        window.addEventListener("resize", () => {

            currentIndex = 0;
            setupClones();
            updateCarousel(false);

        });

        updateCarousel(false);
        startAutoSlide();

    }


    // =========================================
    // CONTACT ENQUIRY FORM
    // =========================================

    // CONTACT ENQUIRY FORM
    const enquiryForm = document.getElementById("projectEnquiryForm");

    if (enquiryForm) {

        enquiryForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const name = document.getElementById("enquiryName").value.trim();
            const service = document.getElementById("enquiryService").value;
            const message = document.getElementById("enquiryMessage").value.trim();

            if (!name || !service || !message) {
                alert("Please complete all fields.");
                return;
            }

            const subject = encodeURIComponent(
                "Digital Intellia Project Enquiry"
            );

            const body = encodeURIComponent(
                "Hello Digital Intellia,\n\n" +
                "My name is " + name + ".\n\n" +
                "I am interested in: " + service + "\n\n" +
                "Project details:\n" + message + "\n\n" +
                "Kind regards,\n" +
                name
            );

            window.location.href =
                "mailto:digitalintellia@gmail.com?subject=" +
                subject + "&body=" + body;

        });

    }


    // =========================================
    // ACTIVE NAVIGATION LINK
    // =========================================

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if ("IntersectionObserver" in window && sections.length && navLinks.length) {

        const sectionObserver = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navLinks.forEach(link => {
                        link.classList.remove("active");
                    });

                    const activeLink = document.querySelector(
                        `.nav-link[href="#${entry.target.id}"]`
                    );

                    if (activeLink) {
                        activeLink.classList.add("active");
                    }

                }

            });

        }, {
            rootMargin: "-35% 0px -55% 0px"
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }

});
