const HomePage = () => {
  return (
    <div className="w-full h-[calc(100vh-70px)] flex flex-col gap-2 p-4 grow-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-2 w-full h-11/12 gap-2">
            <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <h2 id='titlePage' className="font-semibold">Welcome to ConstructOS!</h2>
                <p className="text-left">ConstructOS is intended to be the one shop stop for all things LLM, and some things Stable Diffusion. You can create Constructs, which is a type character. You can import Constructs from Traditional Character cards, in both V1 and V2 format, but a lot of fields will be missing, and I'd highly reccomend taking the time to expore the edit UI for all imported cards. Thought patterns, sprites, greetings, farewells, relationships, and interests are all unique to ConstructOS and if you intended to do more than RP with your character, it will be highly beneficial to fully flesh out your construct.</p>
                <h3 className="font-semibold text-left">What is a Construct?</h3>
                <p className="text-left">
                  The idea behind the naming of "ConstructOS" was based upon the term "Artifical Personality Construct" from the video game series "Portal" by Valve Software. This is because inside of the game, the "Personality Cores" or "Artifical Personality Constructs" are intelligent, thinking beings, that can perform actions and complete tasks, but are completely artificial.
                  I think the idea behind Constructs, in both portal and here, greatly reflect a "Magical Construct" in mythos and literature. Which, is a golem or creature which is created by enchanting or assembling in animate matter, such as clay, wood, or metal, to resemble a human or animal. In the case of our Constructs, they are created with code and information, to resemble a human persona.
                  <br/>
                  <br/>
                  Within this app, you can have your Constructs do many things; from traditional RP/Chat format either within the UI or within Discord, having them comment and help complete your work inside the completions page, turning them loose on the web to help you complete a task, and lastly, turning them to active and watching them choose to enact actions and think all on their own.
                </p>
            </div>
            <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <h2 className="font-semibold">What do I do from here?</h2>
                <p className="text-left">You can use the navbar in the top right to navigate to the different pages of the app. First I'd check out the Constructs page and view our starter personas. After that you should head to the settings page to configure your LLM connection, and the UI theme. Then I'd head over to the chat page and get chatting with some of them so you can get a feel for the UI, and how everything works. If you're interested, configuring the discord bot to work with your Constructs is very easy, and is fully explained withing the Discord Bot page.</p>

            </div>
        </div>
    </div>
  );
};

export default HomePage;
