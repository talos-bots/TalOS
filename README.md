# TalOS
![TalOSLinesLogoClean](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/d43eb0d1-dcdd-4b4c-abf9-3ecda3b2d996)
TalOS is intended to be the one shop stop for all things LLM, and some things Stable Diffusion. You can create Constructs, which is a type character. You can import Constructs from Traditional Character cards, in both V1 and V2 format, but a lot of fields will be missing, and I'd highly reccomend taking the time to expore the edit UI for all imported cards. Thought patterns, sprites, greetings, farewells, relationships, and interests are all unique to TalOS and if you intended to do more than RP with your character, it will be highly beneficial to fully flesh out your construct.
## Development Build Setup
1. Download the Repo using ```git clone https://github.com/WaywardWyvernsSoftworks/TalOS.git```
2. Ensure you have needed dependencies, which luckily for this application only includes Node.JS which can be downloaded here (downloading the LTS build is reccommended): https://nodejs.org/en
3. Go inside of the root of the cloned repo, and run the 'dev-run.bat' or 'dev-run.sh'.
### You're done! The app will open up a window, and you can explore the rest from there.
## Overview
- Compatible with OAI keys, Kobold (Normal and CPP), Oobabooga Text Gen WebUI, PALM 2, and Claude and OAI proxies.
- Chat with AI like in SillyTavern or any other LLM chat app.
- Desktop app, one install, no NPM I or installation of Python.
- VectorDB (Long Term Memories)
- Discord Bot
- - Stable Diffusion connection, use your local machine to generate images on Discord!
  - chat with one or multiple Constructs (Characters) through one bot at the sametime!
  - General Purpose commands, autorole, and more.
- Lorebooks (World Info) to pair with all modes.
- Instruct Mode, have the LLM complete tasks or instructions in UI or through Discord
- Web Browsing LLM
- LLM Completions (Code, Novel, Script, Song, etc.)
- Stable Diffusion Extension (Auto1111 API)
- Sprites, VRMs, Live2D
- and much much more! Find more details at the project board, or the planned features section below. Feel free to join our Discord to ask questions, get help, or join the team!
### Discord Server:
https://discord.com/invite/HNSaTjExYy
## Planned Features
### LLaMA.cpp
- Download, Run, and Configure GGUF or GGML inside of the app. No Kobold.cpp, Oobabooga, or LM Studio required. **(In Progress)**
### Document Completion
- Inspired by CoPilot and NovelAI, the completions page will allow you to utilize Lorebooks, VectorDBs, and other features to help you code scripts, or write documents.
### Guided Experience
- App Tutorial with IntroJS with a REACT Wrapper. **(In Progress)**
- Documents Page with Guides on usage.
### Create Constructs
- Export to V2 Cards **(Done)**
- Create AI Assistants or RP Characters. **(Done)**
- Use LLM to help you create persona details for your character. **(Done)**
- Use Stable Diffusion to create profile images for your character. **(Done)**
### Thoughts **(Done)**
- Have your Construct or RP Character think inside of Discord, or the chat window.
- Adds depth to Characters, and will likely increase quality of RP and chat output.
### Multi-Construct Discord Bot
- Have multiple Constructs speak through one discord bot. **(Done)**
- Group ordering
- Reply percentages, lurking, etc. **(Done)**
- GIF sending, web browsing, vector memories, and RP.
### Construct Chat Window
- A way to test agent features, personalities, and other features. **(Done)**
- Lorebooks (World Info) **(Done)**
### Command Line Interface
- Start functions by using a CLI inside the window.
- Novelty more than functionality.
### SMS Bot (with Twilo)
- Everything the discord bot has, but on your phone's default messaging app.
### Stable Diffusion
- Have your Construct make prompts for you, create images for you, or send you selfies. **(Done)**
- Full Discord integration **(Done)**
- - Use /cosimagine to connect to your local Automatic1111 WebUI instance to generate images on Discord! **(Done)**
  - React to any message with valid text with a 🖼️ and it will generate an image with that prompt! **(Done)**
### Statistics Page
- See info on Discord usage, Construct Actions, and other usage stats.
## View the Project Board
https://github.com/orgs/WaywardWyvernsSoftworks/projects/2
## Current State of UI
### Homepage
![Home](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/08677b3d-501a-46e5-9fd2-687d5173fa39)
### Chat Page
![ChatHome](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/9623abf8-0f9c-4c3f-89a1-b9999a5be716)
![ChatWindow](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/d7fed060-2895-4001-b356-78a6704b09a4)
![ChatWindow1](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/d8c7184f-c0be-407d-b49e-b3d3d002af72)
![ChatWindow2](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/b8741460-d373-4a3e-b308-7bef1ed0bd25)

### Constructs Page
![ConstructHome](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/8bfa1a65-0d61-46bf-b24f-98be21b03dbb)
![ConstructExpand](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/446c8c57-ddbf-4ef0-8766-b69282f2d8ca)
![ConstructEdit1](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/a5d6c55f-07d4-42e2-820f-8d2cc2558050)
![ConstructEdit2](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/ca9dba52-f5ce-4e45-ae09-95963dfe4cab)
### Lorebooks Page
![LorebookHome](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/3396d216-2d43-4d2d-a250-07333674afbb)
### Discord Bot Page
![Discord](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/26ccc4db-ddc1-40b1-9d65-fc98ecaf7b5e)
### User Profiles Page
![UserHome](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/1b9458fd-de85-4ea9-9459-24785eda5105)
### Settings Page
![Settings](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/af87e37d-fb9d-4dbf-bdb5-a241572bb255)
### Atachments Page
![Attachments](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/0788cb50-cfc5-4a75-a1d6-788d57c198a8)
### Zero Shot
![ZeroShot](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/38d2599c-7e55-42ec-a490-d9bde82e1638)
### Themes
**Dark Mode (Default)**
![Screenshot 2023-09-05 214252](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/9e6c2b91-133c-46b3-9d9f-9c1788199c6e)
**Light Mode**
![Screenshot 2023-09-05 214350](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/e6e30b34-bf44-44ad-893d-41c2e777bfb3)
**Green**
![Screenshot 2023-09-05 214410](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/61182e3c-0a61-4d32-b3c5-0ef081ccab27)
**Blue**
![Screenshot 2023-09-05 214427](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/56f9e563-774f-4afd-903f-be65c7a4465f)
**Red**
![Screenshot 2023-09-05 214453](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/aa2ec91f-7ae6-4833-99eb-528b3d492f89)
**Purple**
![Screenshot 2023-09-05 214511](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/39e5c357-f5f4-419b-ae26-ee0096747c08)
**Mustard**
![Screenshot 2023-09-05 214535](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/06e61cdf-75b8-426e-bc69-bafc12f5ce50)
**Orange**
![Screenshot 2023-09-05 214556](https://github.com/WaywardWyvernsSoftworks/TalOS/assets/26259870/72392e09-4171-46d9-8084-f4b377519586)
