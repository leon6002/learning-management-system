import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href='/'>
      <Image
        src='/logoVector.svg'
        alt='Logo'
        width={130}
        height={130}
        className='cursor-pointer'
      />
    </Link>
  );
};

export default Logo;
