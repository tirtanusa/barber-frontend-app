const ProductCard = () => {
  return (
    <>
      <div className="border border-white w-[463px] h-[627px]">
        <div className="flex items-center justify-center h-1/5 font-azeretMono text-center w-full text-[40px]">
          Nama
        </div>
        <div className="h-3/5 bg-white"></div>
        <div className="h-1/5 flex items-center justify-between px-6">
          <p className="font-azeretMono text-[24px]">Pomade</p>
          <p className="font-azeretMono text-[40px]">25k</p>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
