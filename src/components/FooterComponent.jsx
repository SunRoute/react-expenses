export default function Footer({ appName }) {
  const year = new Date().getFullYear();

  return (
    <footer className="text-center text-sm text-gray-500 py-4">
      © {year} {appName} by SunRoute
    </footer>
  );
}
