export default function GridShape() {
  return (
    <>
      <div className="absolute top-0 right-0 w-full max-w-[250px] xl:max-w-[450px] opacity-10 z-0">
        <img
          src="https://source.unsplash.com/250x250/?grid,pattern"
          alt="grid"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full max-w-[250px] rotate-180 xl:max-w-[450px] opacity-10 z-0">
        <img
          src="https://source.unsplash.com/250x250/?grid,shape"
          alt="grid"
        />
      </div>
    </>
  );
}
