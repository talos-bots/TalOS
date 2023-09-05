const LorebooksPage = () => {
    return (
    <div className="w-95vw h-[calc(100vh-70px)] flex flex-col justify-center items-center gap-8 m-auto grow-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-3 m-auto w-full h-11/12 gap-2">
            <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <h3 className="font-semibold">Lorebooks</h3>
            </div>
            <div className="col-span-2 themed-root gap-2 h-full overflow-y-auto flex flex-col">
            </div>
        </div>
    </div>
    );
}
export default LorebooksPage;