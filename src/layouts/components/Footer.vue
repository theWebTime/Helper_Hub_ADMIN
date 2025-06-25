<template>
  <footer class="app-footer">
    <div class="footer-content">
      <span class="copyright">
        &copy; {{ new Date().getFullYear() }} Quotation Hub
      </span>
      <a href="tel:+917862813861" class="developer-link" aria-label="Call to connect with The Web Time IT Solution">
        Developed By The Web Time IT Solution
      </a>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  padding: 20px 0;
  /* Slightly more padding for a bit more visual space */
  background: #f8f8f8;
  /* A very light grey, subtly different from white */
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eee;
  /* Adds a subtle top border */

  /* If you need a fixed footer, uncomment these lines */
  /* position: fixed; */
  /* bottom: 0; */
  /* left: 0; */
  /* z-index: 1000; Ensure it's above other content if fixed */
}

.footer-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* Allows wrapping on smaller screens */
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  /* Slightly smaller for typical footer text */
  color: #555;
  /* Softer text color */
  gap: 12px;
  /* Increased gap for better separation */
  text-align: center;
}

.copyright {
  white-space: nowrap;
  /* Prevents line breaks within the copyright */
}

.developer-link {
  color: #007bff;
  /* A more standard blue for links */
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.2s ease-in-out;
  /* Smooth transition for hover */
}

.developer-link:hover,
.developer-link:focus {
  color: #0056b3;
  /* Darker blue on hover/focus */
  text-decoration: underline;
  /* Underline on hover/focus */
  outline: none;
  /* Remove default focus outline if you provide your own */
}

@media (max-width: 600px) {
  .footer-content {
    flex-direction: column;
    gap: 8px;
    /* Adjusted gap for column layout */
    font-size: 0.9rem;
    /* Slightly smaller font on very small screens */
  }
}
</style>