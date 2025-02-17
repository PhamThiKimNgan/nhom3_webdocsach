import Link from 'next/link';

const PrimaryNavigation = ({ isMobile }: { isMobile: boolean }) => {
    // Conditionally render navigation based on screen size
    if (isMobile) {
        // Implement mobile navigation (e.g., drawer, hamburger menu)
        return <MobileNavigation />; 
    } else {
        return (
            <nav>
                <ul className="flex">
                    <NavItem href="/" text="Trang Chủ" />
                    <NavItem href="/originals" text="Originals" />
                    <NavItem href="/music" text="Âm Nhạc" />
                    <NavItem href="/kids" text="Trẻ Em" />
                    <NavItem href="/browse-more" text="Thêm" />
                </ul>
            </nav>
          );
    }
};

const NavItem = ({href, text}:{href:string, text:string}) => (
  <li>
    <Link href={href}>
      <a>{text}</a>
    </Link>
  </li>
)


const MobileNavigation = () => {
    // Implement your mobile navigation here (e.g., a hamburger menu)
    return (
      <div> {/* Replace with your mobile navigation implementation */}
          {/* Example: */}
          <button>
              {/* Hamburger icon */}
          </button>
          {/* Navigation links (hidden by default, toggle visibility on button click) */}
      </div>
    );
};



export default PrimaryNavigation;