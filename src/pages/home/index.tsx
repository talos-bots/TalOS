const HomePage = () => {
  return (
    <div className="w-95vw h-[calc(100vh-70px)] flex flex-col justify-center items-center gap-2 m-auto grow-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-2 m-auto w-full h-11/12 gap-2">
            <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <h2 id='titlePage' className="font-semibold">Welcome to ConstructOS!</h2>
            </div>
            <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <h2 className="font-semibold">What do I do from here?</h2>
            </div>
        </div>
    </div>
  );
};

export default HomePage;
