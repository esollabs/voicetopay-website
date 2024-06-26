import wormholeSvg from '@src/assets/svgs/wormhole.svg';

const Footer = () => {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-center gap-2">
        <h3 className="text-base font-medium text-[#8C8CA6]">Leverage</h3>
        <img src={wormholeSvg} alt="wormhole" className="h-[24px] w-[24px] object-cover" />
        <h3 className="text-base font-medium text-[#8C8CA6]">protocol</h3>
      </div>
    </div>
  );
};

export default Footer;
