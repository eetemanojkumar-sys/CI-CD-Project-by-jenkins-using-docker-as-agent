const BookingBar = () => {
  return (
    <a
      href="tel:7075959303"
      className="fixed bottom-0 left-0 right-0 h-16 bg-accent text-accent-foreground flex items-center justify-center z-50 active:scale-[0.98] transition-transform duration-300"
    >
      <span className="font-mono text-sm font-medium tracking-tight uppercase">
        Reserve a Table — Call Now
      </span>
    </a>
  );
};

export default BookingBar;
