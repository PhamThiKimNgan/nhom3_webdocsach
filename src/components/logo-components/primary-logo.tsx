import Image from 'next/image';
import Link from 'next/link';

const PrimaryLogo = () => {
  return (
    <Link href="/" title="">
      <Image
        src="https://cdn.popsww.com/popsapp/assets/images/icons/logo-pops.png"
        alt="POPS"
        width={120}
        height={39}
        priority // For better performance
      />
    </Link>
  );
};

export {PrimaryLogo};