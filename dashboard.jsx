import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const ALBUMS = [
  { artist: "The Beach Boys", title: "Pet Sounds", year: 1966, genre: "Pop / Rock", section: "/mu/-core", listenOrder: 1, rank: 131, tier: "B", priorListen: true, listened: true },
  { artist: "Captain Beefheart", title: "Safe as Milk", year: 1967, genre: "Pop / Rock", section: "Classics", listenOrder: 182, rank: 123, tier: "B", listened: true },
  { artist: "Captain Beefheart", title: "Trout Mask Replica", year: 1969, genre: "Experimental", section: "/mu/-core", listenOrder: 2, rank: 203, tier: "F", listened: true },
  { artist: "Pink Floyd", title: "Meddle", year: 1971, genre: "Prog", section: "Classics", listenOrder: 38, rank: 202, tier: "F", listened: true },
  { artist: "Pink Floyd", title: "The Dark Side of the Moon", year: 1973, genre: "Prog", section: "Classics", priorListen: true, listened: false },
  { artist: "Pink Floyd", title: "Wish You Were Here", year: 1975, genre: "Prog", section: "/mu/-core", listenOrder: 3, rank: 132, tier: "B", listened: true },
  { artist: "Pink Floyd", title: "Animals", year: 1977, genre: "Prog", section: "Classics", listened: false },
  { artist: "Talking Heads", title: "Remain in Light", year: 1980, genre: "Punk / Post-Punk", section: "/mu/-core", listenOrder: 4, rank: 15, tier: "S", listened: true },
  { artist: "Slint", title: "Spiderland", year: 1991, genre: "Punk / Post-Punk", section: "/mu/-core", listenOrder: 5, rank: 9, tier: "SS", priorListen: true, listened: true },
  { artist: "Swans", title: "Filth", year: 1983, genre: "Industrial", section: "Classics", listenOrder: 166, rank: 97, tier: "B", listened: true },
  { artist: "Swans", title: "Children of God", year: 1987, genre: "Experimental", section: "Classics", listened: false },
  { artist: "Swans", title: "Soundtracks for the Blind", year: 1996, genre: "Experimental", section: "/mu/-core", listenOrder: 6, rank: 64, tier: "A", listened: true },
  { artist: "Swans", title: "The Seer", year: 2012, genre: "Experimental", section: "Modern", priorListen: true, listened: false },
  { artist: "Swans", title: "To Be Kind", year: 2014, genre: "Experimental", section: "Modern", listenOrder: 96, rank: 53, tier: "A", listened: true },
  { artist: "Fishmans", title: "Long Season", year: 1996, genre: "Indie / Alt", section: "Modern", listened: false },
  { artist: "Fishmans", title: "98.12.28 男達の別れ", year: 1999, genre: "Indie / Alt", section: "/mu/-core", listenOrder: 7, rank: 201, tier: "F", listened: true },
  { artist: "Animal Collective", title: "Spirit They're Gone, Spirit They've Vanished", year: 2000, genre: "Experimental", section: "/mu/-core", listenOrder: 8, rank: 139, tier: "C", priorListen: true, listened: true },
  { artist: "Animal Collective", title: "Strawberry Jam", year: 2007, genre: "Indie / Alt", section: "Modern", priorListen: true, listened: false },
  { artist: "Animal Collective", title: "Merriweather Post Pavilion", year: 2009, genre: "Indie / Alt", section: "Modern", priorListen: true, listened: false },
  { artist: "Death Grips", title: "Exmilitary", year: 2011, genre: "Hip-Hop", section: "/mu/-core", listenOrder: 9, rank: 62, tier: "A", priorListen: true, listened: true },
  { artist: "Death Grips", title: "The Money Store", year: 2012, genre: "Hip-Hop", section: "Modern", priorListen: true, listened: false },
  { artist: "Death Grips", title: "No Love Deep Web", year: 2012, genre: "Hip-Hop", section: "Modern", listenOrder: 140, rank: 80, tier: "B", priorListen: true, listened: true },
  { artist: "Death Grips", title: "Niggas on the Moon", year: 2014, genre: "Hip-Hop", section: "Hip-Hop", priorListen: true, listened: false },
  { artist: "Death Grips", title: "Steroids", year: 2017, genre: "Hip-Hop", section: "Electronic", listenOrder: 158, rank: 189, tier: "D", listened: true },
  { artist: "The Velvet Underground", title: "The Velvet Underground & Nico", year: 1967, genre: "Pop / Rock", section: "/mu/-core", listenOrder: 10, rank: 66, tier: "A", listened: true },
  { artist: "King Crimson", title: "In the Court of the Crimson King", year: 1969, genre: "Prog", section: "/mu/-core", listenOrder: 11, rank: 196, tier: "D", listened: true },
  { artist: "My Bloody Valentine", title: "You Made Me Realise", year: 1988, genre: "Indie / Alt", section: "Classics", listenOrder: 27, rank: 121, tier: "B", listened: true },
  { artist: "My Bloody Valentine", title: "Isn't Anything", year: 1988, genre: "Indie / Alt", section: "Classics", listenOrder: 157, rank: 150, tier: "C", listened: true },
  { artist: "My Bloody Valentine", title: "Loveless", year: 1991, genre: "Indie / Alt", section: "/mu/-core", listenOrder: 13, rank: 38, tier: "S", priorListen: true, listened: true },
  { artist: "Aphex Twin", title: "Selected Ambient Works 85-92", year: 1992, genre: "Electronic", section: "/mu/-core", listenOrder: 14, rank: 188, tier: "D", listened: true },
  { artist: "Neutral Milk Hotel", title: "In the Aeroplane Over the Sea", year: 1998, genre: "Indie / Alt", section: "/mu/-core", listenOrder: 15, rank: 8, tier: "SS", priorListen: true, listened: true },
  { artist: "Radiohead", title: "OK Computer", year: 1997, genre: "Indie / Alt", section: "Modern", priorListen: true, listened: false },
  { artist: "Radiohead", title: "Kid A", year: 2000, genre: "Indie / Alt", section: "/mu/-core", listenOrder: 16, rank: 44, tier: "A", priorListen: true, listened: true },
  { artist: "Radiohead", title: "In Rainbows", year: 2007, genre: "Indie / Alt", section: "Modern", listenOrder: 185, rank: 10, tier: "SS", priorListen: true, listened: true },
  { artist: "Sweet Trip", title: "Velocity : Design : Comfort", year: 2003, genre: "Electronic", section: "/mu/-core", listenOrder: 17, rank: 200, tier: "F", listened: true },
  { artist: "Kanye West", title: "My Beautiful Dark Twisted Fantasy", year: 2010, genre: "Hip-Hop", section: "Modern", listenOrder: 76, rank: 39, tier: "S", priorListen: true, listened: true },
  { artist: "Kanye West", title: "Yeezus", year: 2013, genre: "Hip-Hop", section: "/mu/-core", listenOrder: 18, rank: 76, tier: "A", priorListen: true, listened: true },
  { artist: "Kanye West", title: "The Life of Pablo", year: 2016, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 212, rank: 24, tier: "S", priorListen: true, listened: true },
  { artist: "Weezer", title: "Pinkerton", year: 1996, genre: "Indie / Alt", section: "Modern", listenOrder: 120, rank: 7, tier: "SS", priorListen: true, listened: true },
  { artist: "Weezer", title: "Weezer [Blue Album]", year: 1994, genre: "Indie / Alt", section: "Modern", listenOrder: 91, rank: 25, tier: "S", listened: true },
  { artist: "Modest Mouse", title: "The Lonesome Crowded West", year: 1997, genre: "Indie / Alt", section: "Modern", priorListen: true, listened: false },
  { artist: "Godspeed You Black Emperor!", title: "F♯A♯∞", year: 1998, genre: "Experimental", section: "Modern", listenOrder: 56, rank: 164, tier: "C", priorListen: true, listened: true },
  { artist: "Godspeed You Black Emperor!", title: "Lift Yr. Skinny Fists Like Antennas to Heaven!", year: 2000, genre: "Experimental", section: "Modern", listenOrder: 37, rank: 63, tier: "A", priorListen: true, listened: true },
  { artist: "Have a Nice Life", title: "Deathconsciousness", year: 2008, genre: "Experimental", section: "Modern", listenOrder: 115, rank: 113, tier: "B", listened: true },
  { artist: "The Microphones", title: "The Glow Pt. 2", year: 2001, genre: "Indie / Alt", section: "Modern", listened: false },
  { artist: "Björk", title: "Homogenic", year: 1997, genre: "Electronic", section: "Modern", listenOrder: 165, rank: 47, tier: "A", listened: true },
  { artist: "Slowdive", title: "Souvlaki", year: 1993, genre: "Indie / Alt", section: "Modern", listenOrder: 105, rank: 86, tier: "B", listened: true },
  { artist: "Interpol", title: "Turn on the Bright Lights", year: 2002, genre: "Indie / Alt", section: "Modern", listenOrder: 110, rank: 90, tier: "B", priorListen: true, listened: true },
  { artist: "Nirvana", title: "In Utero", year: 1993, genre: "Indie / Alt", section: "Modern", listenOrder: 208, rank: 21, tier: "S", priorListen: true, listened: true },
  { artist: "Fugazi", title: "Red Medicine", year: 1995, genre: "Punk / Post-Punk", section: "Modern", listenOrder: 195, rank: 160, tier: "C", listened: true },
  { artist: "Fugazi", title: "Fugazi", year: 1988, genre: "Punk / Post-Punk", section: "Classics", listened: false },
  { artist: "The Strokes", title: "Is This It", year: 2001, genre: "Indie / Alt", section: "Modern", listenOrder: 160, rank: 54, tier: "A", priorListen: true, listened: true },
  { artist: "Broadcast", title: "Tender Buttons", year: 2005, genre: "Electronic", section: "Modern", listenOrder: 170, rank: 46, tier: "A", listened: true },
  { artist: "Stereolab", title: "Emperor Tomato Ketchup", year: 1996, genre: "Indie / Alt", section: "Modern", listenOrder: 41, rank: 187, tier: "D", listened: true },
  { artist: "Talk Talk", title: "Spirit of Eden", year: 1988, genre: "Experimental", section: "Classics", listenOrder: 73, rank: 174, tier: "C", listened: true },
  { artist: "Talk Talk", title: "Laughing Stock", year: 1991, genre: "Experimental", section: "Modern", listenOrder: 180, rank: 136, tier: "C", listened: true },
  { artist: "The Mars Volta", title: "Frances the Mute", year: 2005, genre: "Prog", section: "Modern", listenOrder: 199, rank: 115, tier: "B", listened: true },
  { artist: "Unwound", title: "Leaves Turn Inside You", year: 2001, genre: "Indie / Alt", section: "Modern", listenOrder: 100, rank: 92, tier: "B", listened: true },
  { artist: "Brand New", title: "The Devil and God Are Raging Inside Me", year: 2006, genre: "Indie / Alt", section: "Modern", listenOrder: 19, rank: 45, tier: "A", priorListen: true, listened: true },
  { artist: "The Magnetic Fields", title: "69 Love Songs", year: 1999, genre: "Indie / Alt", section: "Modern", listenOrder: 145, rank: 192, tier: "D", listened: true },
  { artist: "Mr. Bungle", title: "Mr. Bungle", year: 1991, genre: "Experimental", section: "Modern", listened: false },
  { artist: "Panda Bear", title: "Person Pitch", year: 2007, genre: "Electronic", section: "Modern", listenOrder: 61, rank: 33, tier: "S", priorListen: true, listened: true },
  { artist: "Car Seat Headrest", title: "Twin Fantasy", year: 2011, genre: "Indie / Alt", section: "Modern", listened: false },
  { artist: "Royal Trux", title: "Twin Infinitives", year: 1990, genre: "Experimental", section: "Modern", listenOrder: 71, rank: 210, tier: "F", listened: true },
  { artist: "Lightning Bolt", title: "Wonderful Rainbow", year: 2003, genre: "Experimental", section: "Modern", listened: false },
  { artist: "Brainbombs", title: "Obey", year: 1996, genre: "Punk / Post-Punk", section: "Modern", listenOrder: 130, rank: 205, tier: "F", listened: true },
  { artist: "Grimes", title: "Visions", year: 2012, genre: "Indie / Alt", section: "Modern", listenOrder: 66, rank: 71, tier: "A", priorListen: true, listened: true },
  { artist: "Queens of the Stone Age", title: "Songs for the Deaf", year: 2002, genre: "Pop / Rock", section: "Modern", listenOrder: 31, rank: 37, tier: "S", priorListen: true, listened: true },
  { artist: "Elliott Smith", title: "Either/Or", year: 1997, genre: "Folk / Singer-Songwriter", section: "Modern", priorListen: true, listened: false },
  { artist: "Lil Ugly Mane", title: "Mista Thug Isolation", year: 2012, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 75, rank: 103, tier: "B", listened: true },
  { artist: "Lil Ugly Mane", title: "THIRD SIDE OF TAPE", year: 2015, genre: "Hip-Hop", section: "Modern", listened: false },
  { artist: "Sufjan Stevens", title: "The Age of Adz", year: 2010, genre: "Indie / Alt", section: "Modern", listenOrder: 175, rank: 19, tier: "S", priorListen: true, listened: true },
  { artist: "Joanna Newsom", title: "Ys", year: 2006, genre: "Folk / Singer-Songwriter", section: "Modern", listenOrder: 51, rank: 1, tier: "SS", priorListen: true, listened: true },
  { artist: "Joanna Newsom", title: "Have One on Me", year: 2010, genre: "Folk / Singer-Songwriter", section: "Modern", listenOrder: 159, rank: 2, tier: "SS", priorListen: true, listened: true },
  { artist: "Nine Inch Nails", title: "The Downward Spiral", year: 1994, genre: "Industrial", section: "Modern", listenOrder: 190, rank: 14, tier: "S", priorListen: true, listened: true },
  { artist: "Peter Sotos", title: "Buyer's Market", year: 1992, genre: "Industrial", section: "Modern", listened: false },
  { artist: "Kero Kero Bonito", title: "Bonito Generation", year: 2016, genre: "Pop / Rock", section: "Modern", listenOrder: 135, rank: 22, tier: "S", priorListen: true, listened: true },
  { artist: "MGMT", title: "Little Dark Age", year: 2018, genre: "Indie / Alt", section: "Modern", priorListen: true, listened: false },
  { artist: "ミドリ (Midori)", title: "あらためまして、はじめまして、ミドリです。", year: 2008, genre: "Punk / Post-Punk", section: "Modern", listenOrder: 203, rank: 122, tier: "B", listened: true },
  { artist: "Wilco", title: "Yankee Hotel Foxtrot", year: 2002, genre: "Indie / Alt", section: "Modern", listenOrder: 154, rank: 23, tier: "S", priorListen: true, listened: true },
  { artist: "The Antlers", title: "Hospice", year: 2009, genre: "Indie / Alt", section: "Modern", priorListen: true, listened: false },
  { artist: "Built to Spill", title: "Perfect from Now On", year: 1997, genre: "Indie / Alt", section: "Modern", listened: false },
  { artist: "The Knife", title: "Silent Shout", year: 2006, genre: "Electronic", section: "Electronic", priorListen: true, listened: false },
  { artist: "The Knife", title: "Shaking the Habitual", year: 2013, genre: "Electronic", section: "Modern", listenOrder: 26, rank: 125, tier: "B", priorListen: true, listened: true },
  { artist: "Frank Ocean", title: "Blonde", year: 2016, genre: "Hip-Hop", section: "Modern", priorListen: true, listened: false },
  { artist: "Coil", title: "The Ape of Naples", year: 2005, genre: "Industrial", section: "Modern", listenOrder: 125, rank: 49, tier: "A", listened: true },
  { artist: "Duster", title: "Stratosphere", year: 1998, genre: "Indie / Alt", section: "Modern", listenOrder: 86, rank: 162, tier: "C", listened: true },
  { artist: "Swirlies", title: "Blonder Tongue Audio Baton", year: 1993, genre: "Indie / Alt", section: "Modern", listened: false },
  { artist: "Ariel Pink", title: "pom pom", year: 2014, genre: "Indie / Alt", section: "Modern", listenOrder: 81, rank: 34, tier: "S", priorListen: true, listened: true },
  { artist: "The Beach Boys", title: "The Smile Sessions", year: 2011, genre: "Pop / Rock", section: "Modern", listenOrder: 46, rank: 198, tier: "D", listened: true },
  { artist: "The Smashing Pumpkins", title: "Mellon Collie and the Infinite Sadness", year: 1995, genre: "Indie / Alt", section: "Modern", listened: false },
  { artist: "Nick Cave & The Bad Seeds", title: "Skeleton Tree", year: 2016, genre: "Folk / Singer-Songwriter", section: "Modern", listened: false },
  { artist: "Boris", title: "Flood", year: 2000, genre: "Metal", section: "Modern", listenOrder: 62, rank: 119, tier: "B", listened: true },
  { artist: "American Football", title: "American Football", year: 1999, genre: "Indie / Alt", section: "Modern", listenOrder: 155, rank: 11, tier: "SS", priorListen: true, listened: true },
  { artist: "Red House Painters", title: "Down Colorful Hill", year: 1992, genre: "Indie / Alt", section: "Modern", listenOrder: 116, rank: 61, tier: "A", listened: true },
  { artist: "Clarence Clarity", title: "No Now", year: 2015, genre: "Pop / Rock", section: "Modern", listenOrder: 141, rank: 72, tier: "A", listened: true },
  { artist: "At the Drive-In", title: "Relationship of Command", year: 2000, genre: "Punk / Post-Punk", section: "Modern", listenOrder: 131, rank: 26, tier: "S", listened: true },
  { artist: "The Brave Little Abacus", title: "Just Got Back From the Discomfort", year: 2010, genre: "Indie / Alt", section: "Modern", listenOrder: 101, rank: 166, tier: "C", listened: true },
  { artist: "Whitehouse", title: "Bird Seed", year: 2003, genre: "Industrial", section: "Modern", listened: false },
  { artist: "The Avalanches", title: "Since I Left You", year: 2000, genre: "Electronic", section: "Modern", listenOrder: 204, rank: 52, tier: "A", priorListen: true, listened: true },
  { artist: "SOPHIE", title: "Oil of Every Pearl's Un-Insides", year: 2018, genre: "Electronic", section: "Modern", listenOrder: 156, rank: 31, tier: "S", priorListen: true, listened: true },
  { artist: "Daughters", title: "You Won't Get What You Want", year: 2018, genre: "Industrial", section: "Modern", listened: false },
  { artist: "Cocteau Twins", title: "Treasure", year: 1984, genre: "Indie / Alt", section: "Classics", listenOrder: 97, rank: 137, tier: "C", listened: true },
  { artist: "Cocteau Twins", title: "Heaven or Las Vegas", year: 1990, genre: "Indie / Alt", section: "Modern", listened: false },
  { artist: "Ween", title: "The Mollusk", year: 1997, genre: "Indie / Alt", section: "Modern", listenOrder: 52, rank: 27, tier: "S", priorListen: true, listened: true },
  { artist: "Crystal Castles", title: "Crystal Castles", year: 2008, genre: "Electronic", section: "Modern", listenOrder: 200, rank: 135, tier: "B", listened: true },
  { artist: "Sun City Girls", title: "Torch of the Mystics", year: 1990, genre: "Experimental", section: "Modern", listenOrder: 25, rank: 211, tier: "F", listened: true },
  { artist: "Low", title: "I Could Live in Hope", year: 1994, genre: "Indie / Alt", section: "Modern", listenOrder: 87, rank: 116, tier: "B", listened: true },
  { artist: "Kids See Ghosts", title: "Kids See Ghosts", year: 2018, genre: "Hip-Hop", section: "Modern", priorListen: true, listened: false },
  { artist: "Songs: Ohia", title: "The Magnolia Electric Co.", year: 2003, genre: "Folk / Singer-Songwriter", section: "Modern", priorListen: true, listened: false },
  { artist: "John Maus", title: "We Must Become the Pitiless Censors of Ourselves", year: 2011, genre: "Indie / Alt", section: "Modern", listenOrder: 161, rank: 182, tier: "D", listened: true },
  { artist: "The Dismemberment Plan", title: "Emergency & I", year: 1999, genre: "Indie / Alt", section: "Modern", listenOrder: 77, rank: 4, tier: "SS", priorListen: true, listened: true },
  { artist: "Sonic Youth", title: "Bad Moon Rising", year: 1985, genre: "Indie / Alt", section: "Classics", listened: false },
  { artist: "Sonic Youth", title: "Daydream Nation", year: 1988, genre: "Indie / Alt", section: "Classics", listenOrder: 32, rank: 107, tier: "B", listened: true },
  { artist: "David Bowie", title: "Ziggy Stardust", year: 1972, genre: "Pop / Rock", section: "Classics", listenOrder: 42, rank: 13, tier: "SS", listened: true },
  { artist: "David Bowie", title: "Low", year: 1977, genre: "Pop / Rock", section: "/mu/-core", listenOrder: 12, rank: 12, tier: "SS", listened: true },
  { artist: "David Bowie", title: "Heroes", year: 1977, genre: "Pop / Rock", section: "Classics", listened: false },
  { artist: "David Bowie", title: "Blackstar", year: 2016, genre: "Pop / Rock", section: "Modern", priorListen: true, listened: false },
  { artist: "Talking Heads", title: "Speaking in Tongues", year: 1983, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 67, rank: 130, tier: "B", listened: true },
  { artist: "Prince", title: "Purple Rain", year: 1984, genre: "Pop / Rock", section: "Classics", priorListen: true, listened: false },
  { artist: "Neil Young", title: "After the Gold Rush", year: 1970, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 149, rank: 69, tier: "A", listened: true },
  { artist: "Yes", title: "Close to the Edge", year: 1972, genre: "Prog", section: "Classics", listenOrder: 95, rank: 133, tier: "B", listened: true },
  { artist: "The Beatles", title: "Revolver", year: 1966, genre: "Pop / Rock", section: "Classics", priorListen: true, listened: false },
  { artist: "The Beatles", title: "Sgt. Pepper's Lonely Hearts Club Band", year: 1967, genre: "Pop / Rock", section: "Classics", listenOrder: 72, rank: 17, tier: "S", priorListen: true, listened: true },
  { artist: "The Beatles", title: "Abbey Road", year: 1969, genre: "Pop / Rock", section: "Classics", listenOrder: 106, rank: 6, tier: "SS", priorListen: true, listened: true },
  { artist: "Bob Dylan", title: "Highway 61 Revisited", year: 1965, genre: "Folk / Singer-Songwriter", section: "Classics", priorListen: true, listened: false },
  { artist: "Bob Dylan", title: "Blonde on Blonde", year: 1966, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 82, rank: 16, tier: "S", priorListen: true, listened: true },
  { artist: "Bob Dylan", title: "Blood on the Tracks", year: 1975, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 181, rank: 32, tier: "S", listened: true },
  { artist: "Television", title: "Marquee Moon", year: 1977, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 126, rank: 81, tier: "B", listened: true },
  { artist: "Joy Division", title: "Unknown Pleasures", year: 1979, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 53, rank: 153, tier: "C", priorListen: true, listened: true },
  { artist: "New Order", title: "Power, Corruption & Lies", year: 1983, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 92, rank: 111, tier: "B", listened: true },
  { artist: "Marvin Gaye", title: "What's Going On", year: 1971, genre: "Pop / Rock", section: "Classics", listened: false },
  { artist: "Wire", title: "Pink Flag", year: 1977, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 47, rank: 120, tier: "B", listened: true },
  { artist: "Wire", title: "Chairs Missing", year: 1978, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 136, rank: 89, tier: "B", listened: true },
  { artist: "The Doors", title: "The Doors", year: 1967, genre: "Pop / Rock", section: "Classics", listened: false },
  { artist: "Tom Waits", title: "Rain Dogs", year: 1985, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 196, rank: 109, tier: "B", listened: true },
  { artist: "Iggy Pop", title: "The Idiot", year: 1977, genre: "Pop / Rock", section: "Classics", listenOrder: 191, rank: 88, tier: "B", listened: true },
  { artist: "Lou Reed", title: "Metal Machine Music", year: 1975, genre: "Experimental", section: "Classics", listenOrder: 111, rank: 197, tier: "D", listened: true },
  { artist: "Nico", title: "Desertshore", year: 1970, genre: "Folk / Singer-Songwriter", section: "Classics", listened: false },
  { artist: "The Velvet Underground", title: "White Light / White Heat", year: 1968, genre: "Pop / Rock", section: "Classics", listenOrder: 88, rank: 65, tier: "A", listened: true },
  { artist: "The Velvet Underground", title: "The Velvet Underground", year: 1969, genre: "Pop / Rock", section: "Classics", listenOrder: 121, rank: 75, tier: "A", listened: true },
  { artist: "King Crimson", title: "Red", year: 1974, genre: "Prog", section: "Classics", listenOrder: 171, rank: 112, tier: "B", listened: true },
  { artist: "King Crimson", title: "Discipline", year: 1981, genre: "Prog", section: "Classics", listened: false },
  { artist: "Frank Zappa", title: "Uncle Meat", year: 1969, genre: "Prog", section: "Classics", listened: false },
  { artist: "Frank Zappa", title: "Hot Rats", year: 1969, genre: "Prog", section: "Classics", listened: false },
  { artist: "Oingo Boingo", title: "Only a Lad", year: 1981, genre: "Punk / Post-Punk", section: "Classics", listened: false },
  { artist: "Jackson C. Frank", title: "Jackson C. Frank", year: 1965, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 186, rank: 190, tier: "D", listened: true },
  { artist: "Michael Jackson", title: "Bad", year: 1987, genre: "Pop / Rock", section: "Classics", listenOrder: 176, rank: 70, tier: "A", listened: true },
  { artist: "Steely Dan", title: "Aja", year: 1977, genre: "Pop / Rock", section: "Classics", listenOrder: 209, rank: 58, tier: "A", listened: true },
  { artist: "Suicide", title: "Suicide", year: 1977, genre: "Punk / Post-Punk", section: "Classics", listened: false },
  { artist: "Brian Eno", title: "Ambient 1: Music for Airports", year: 1979, genre: "Electronic", section: "Electronic", listenOrder: 22, rank: 195, tier: "D", listened: true, group: "Brian Eno" },
  { artist: "Brian Eno & David Byrne", title: "My Life in the Bush of Ghosts", year: 1981, genre: "Electronic", section: "Classics", listened: false, group: "Brian Eno" },
  { artist: "Morton Feldman", title: "Rothko Chapel + Why Patterns?", year: 1991, genre: "Experimental", section: "Classics", listened: false },
  { artist: "Gang of Four", title: "Entertainment!", year: 1979, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 197, rank: 100, tier: "B", listened: true },
  { artist: "This Heat", title: "Deceit", year: 1981, genre: "Experimental", section: "Classics", listened: false },
  { artist: "NEU!", title: "NEU!", year: 1972, genre: "Experimental", section: "Classics", listenOrder: 122, rank: 159, tier: "C", listened: true },
  { artist: "Dinosaur Jr.", title: "You're Living All Over Me", year: 1987, genre: "Indie / Alt", section: "Classics", listened: false },
  { artist: "Pixies", title: "Surfer Rosa", year: 1988, genre: "Indie / Alt", section: "Classics", listenOrder: 58, rank: 74, tier: "A", listened: true },
  { artist: "Pixies", title: "Doolittle", year: 1989, genre: "Indie / Alt", section: "Classics", listenOrder: 151, rank: 20, tier: "S", priorListen: true, listened: true },
  { artist: "The Who", title: "Who's Next", year: 1971, genre: "Pop / Rock", section: "Classics", listenOrder: 205, rank: 143, tier: "C", listened: true },
  { artist: "Big Black", title: "Atomizer", year: 1986, genre: "Industrial", section: "Classics", listenOrder: 132, rank: 82, tier: "B", listened: true },
  { artist: "Big Black", title: "Songs About Fucking", year: 1987, genre: "Industrial", section: "Classics", listenOrder: 112, rank: 83, tier: "B", listened: true },
  { artist: "John Fahey", title: "The Great Santa Barbara Oil Slick", year: 2004, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 142, rank: 172, tier: "C", listened: true },
  { artist: "Popol Vuh", title: "Hosianna Mantra", year: 1972, genre: "Experimental", section: "Classics", listenOrder: 162, rank: 149, tier: "C", listened: true },
  { artist: "Nick Drake", title: "Pink Moon", year: 1972, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 102, rank: 77, tier: "A", priorListen: true, listened: true },
  { artist: "Hüsker Dü", title: "Zen Arcade", year: 1984, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 117, rank: 138, tier: "C", listened: true },
  { artist: "Young Marble Giants", title: "Colossal Youth", year: 1980, genre: "Punk / Post-Punk", section: "Classics", listened: false },
  { artist: "Comus", title: "First Utterance", year: 1971, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 192, rank: 78, tier: "A", listened: true },
  { artist: "Exuma", title: "Exuma", year: 1970, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 93, rank: 161, tier: "C", listened: true },
  { artist: "Hosono / Suzuki / Yamashita", title: "Pacific", year: 1978, genre: "Pop / Rock", section: "Classics", listenOrder: 146, rank: 146, tier: "C", listened: true },
  { artist: "Henry Cow", title: "In Praise of Learning", year: 1975, genre: "Experimental", section: "Classics", listenOrder: 127, rank: 94, tier: "B", listened: true },
  { artist: "The Smiths", title: "The Smiths", year: 1984, genre: "Indie / Alt", section: "Classics", listenOrder: 150, rank: 87, tier: "B", listened: true },
  { artist: "The Cure", title: "Pornography", year: 1982, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 33, rank: 29, tier: "S", listened: true },
  { artist: "The Pop Group", title: "Y", year: 1979, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 107, rank: 212, tier: "F", listened: true },
  { artist: "Pere Ubu", title: "The Modern Dance", year: 1978, genre: "Punk / Post-Punk", section: "Classics", listened: false },
  { artist: "Minutemen", title: "Double Nickels on the Dime", year: 1984, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 63, rank: 110, tier: "B", listened: true },
  { artist: "Tim Buckley", title: "Lorca", year: 1970, genre: "Folk / Singer-Songwriter", section: "Classics", listened: false },
  { artist: "Tim Buckley", title: "Starsailor", year: 1970, genre: "Experimental", section: "Classics", listened: false },
  { artist: "Soft Machine", title: "Third", year: 1970, genre: "Prog", section: "Classics", listened: false },
  { artist: "The Replacements", title: "Let It Be", year: 1984, genre: "Indie / Alt", section: "Classics", listenOrder: 167, rank: 28, tier: "S", listened: true },
  { artist: "Faust", title: "Faust", year: 1971, genre: "Experimental", section: "Classics", listened: false },
  { artist: "不失者 (Fushitsusha)", title: "1st", year: 1989, genre: "Experimental", section: "Classics", listened: false },
  { artist: "Les Rallizes Dénudés", title: "'77 Live", year: 1991, genre: "Experimental", section: "Classics", listenOrder: 202, rank: 204, tier: "F", listened: true },
  { artist: "XTC", title: "Skylarking", year: 1986, genre: "Pop / Rock", section: "Classics", listenOrder: 83, rank: 18, tier: "S", priorListen: true, listened: true },
  { artist: "Black Flag", title: "Damaged", year: 1981, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 43, rank: 180, tier: "D", listened: true },
  { artist: "Kate Bush", title: "Hounds of Love", year: 1985, genre: "Pop / Rock", section: "Classics", listenOrder: 172, rank: 30, tier: "S", priorListen: true, listened: true },
  { artist: "Can", title: "Tago Mago", year: 1971, genre: "Experimental", section: "Classics", listenOrder: 187, rank: 95, tier: "B", listened: true },
  { artist: "Can", title: "Future Days", year: 1973, genre: "Experimental", section: "Classics", listenOrder: 210, rank: 108, tier: "B", listened: true },
  { artist: "Daniel Johnston", title: "Hi, How Are You?", year: 1983, genre: "Folk / Singer-Songwriter", section: "Classics", listened: false },
  { artist: "Magma", title: "Mekanïk Destruktïẁ Kommandöh", year: 1973, genre: "Prog", section: "Classics", listenOrder: 137, rank: 207, tier: "F", listened: true },
  { artist: "Funkadelic", title: "Maggot Brain", year: 1971, genre: "Pop / Rock", section: "Classics", listened: false },
  { artist: "The Stone Roses", title: "The Stone Roses", year: 1989, genre: "Indie / Alt", section: "Classics", listenOrder: 177, rank: 114, tier: "B", listened: true },
  { artist: "Jethro Tull", title: "Thick as a Brick", year: 1972, genre: "Prog", section: "Classics", listenOrder: 57, rank: 169, tier: "C", listened: true },
  { artist: "Scraping Foetus Off the Wheel", title: "Nail", year: 1985, genre: "Industrial", section: "Classics", listened: false },
  { artist: "Violent Femmes", title: "Violent Femmes", year: 1983, genre: "Indie / Alt", section: "Classics", listened: false },
  { artist: "Public Image Ltd.", title: "Metal Box", year: 1979, genre: "Punk / Post-Punk", section: "Classics", listened: false },
  { artist: "Glenn Branca", title: "The Ascension", year: 1981, genre: "Experimental", section: "Classics", listenOrder: 48, rank: 186, tier: "D", listened: true },
  { artist: "Sparks", title: "Kimono My House", year: 1974, genre: "Pop / Rock", section: "Classics", listened: false },
  { artist: "Fleetwood Mac", title: "Rumours", year: 1977, genre: "Pop / Rock", section: "Classics", listenOrder: 20, rank: 140, tier: "C", priorListen: true, listened: true },
  { artist: "Elvis Costello", title: "This Year's Model", year: 1978, genre: "Punk / Post-Punk", section: "Classics", listened: false },
  { artist: "The Rolling Stones", title: "Exile on Main St.", year: 1972, genre: "Pop / Rock", section: "Classics", listenOrder: 68, rank: 144, tier: "C", listened: true },
  { artist: "Led Zeppelin", title: "Led Zeppelin IV", year: 1971, genre: "Pop / Rock", section: "Classics", listenOrder: 78, rank: 141, tier: "C", listened: true },
  { artist: "Germs", title: "(GI)", year: 1979, genre: "Punk / Post-Punk", section: "Classics", listenOrder: 28, rank: 181, tier: "D", listened: true },
  { artist: "Leonard Cohen", title: "Songs of Love and Hate", year: 1971, genre: "Folk / Singer-Songwriter", section: "Classics", listenOrder: 34, rank: 165, tier: "C", listened: true },
  { artist: "John Coltrane", title: "A Love Supreme", year: 1965, genre: "Jazz", section: "Jazz", listenOrder: 59, rank: 105, tier: "B", listened: true },
  { artist: "Charles Mingus", title: "The Black Saint and the Sinner Lady", year: 1963, genre: "Jazz", section: "Jazz", listenOrder: 152, rank: 35, tier: "S", listened: true },
  { artist: "Miles Davis", title: "Bitches Brew", year: 1970, genre: "Jazz", section: "Jazz", listenOrder: 198, rank: 68, tier: "A", listened: true },
  { artist: "Sun Ra", title: "Atlantis", year: 1969, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Peter Brötzmann Octet", title: "Machine Gun", year: 1968, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Frank Sinatra", title: "In the Wee Small Hours", year: 1955, genre: "Jazz", section: "Jazz", listenOrder: 206, rank: 170, tier: "C", listened: true },
  { artist: "Stan Getz & João Gilberto", title: "Getz/Gilberto", year: 1964, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Max Roach", title: "We Insist!", year: 1960, genre: "Jazz", section: "Jazz", listenOrder: 94, rank: 206, tier: "F", listened: true },
  { artist: "Albert Ayler", title: "Spiritual Unity", year: 1965, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Grant Green", title: "Idle Moments", year: 1965, genre: "Jazz", section: "Jazz", listenOrder: 193, rank: 99, tier: "B", listened: true },
  { artist: "Alice Coltrane", title: "Journey in Satchidananda", year: 1971, genre: "Jazz", section: "Jazz", listenOrder: 79, rank: 129, tier: "B", listened: true },
  { artist: "Ryo Fukui", title: "Scenery", year: 1976, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Herbie Hancock", title: "Head Hunters", year: 1973, genre: "Jazz", section: "Jazz", listenOrder: 103, rank: 67, tier: "A", listened: true },
  { artist: "Eric Dolphy", title: "Out to Lunch", year: 1964, genre: "Jazz", section: "Jazz", listenOrder: 188, rank: 183, tier: "D", listened: true },
  { artist: "Sonny Rollins", title: "Saxophone Colossus", year: 1957, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Cecil Taylor", title: "Unit Structures", year: 1966, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Matana Roberts", title: "Coin Coin Chapter One", year: 2011, genre: "Jazz", section: "Jazz", listenOrder: 98, rank: 43, tier: "A", listened: true },
  { artist: "Moondog", title: "Moondog", year: 1969, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Andrew Hill", title: "Point of Departure", year: 1965, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Wayne Shorter", title: "Speak No Evil", year: 1966, genre: "Jazz", section: "Jazz", listenOrder: 21, rank: 158, tier: "C", listened: true },
  { artist: "Art Blakey and The Jazz Messengers", title: "Moanin'", year: 1959, genre: "Jazz", section: "Jazz", listenOrder: 113, rank: 73, tier: "A", listened: true },
  { artist: "Bill Evans Trio", title: "Waltz for Debby", year: 1962, genre: "Jazz", section: "Jazz", listenOrder: 163, rank: 98, tier: "B", listened: true },
  { artist: "Vince Guaraldi", title: "A Charlie Brown Christmas", year: 1965, genre: "Jazz", section: "Jazz", listenOrder: 133, rank: 40, tier: "S", listened: true },
  { artist: "Cannonball Adderley", title: "Somethin' Else", year: 1958, genre: "Jazz", section: "Jazz", listenOrder: 118, rank: 185, tier: "D", listened: true },
  { artist: "Ornette Coleman", title: "The Shape of Jazz to Come", year: 1959, genre: "Jazz", section: "Jazz", listenOrder: 49, rank: 51, tier: "A", priorListen: true, listened: true },
  { artist: "Lee Morgan", title: "The Sidewinder", year: 1964, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Freddie Hubbard", title: "Red Clay", year: 1970, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "The Dave Brubeck Quartet", title: "Time Out", year: 1959, genre: "Jazz", section: "Jazz", listenOrder: 64, rank: 106, tier: "B", priorListen: true, listened: true },
  { artist: "Thelonious Monk", title: "Monk's Dream", year: 1963, genre: "Jazz", section: "Jazz", listenOrder: 128, rank: 193, tier: "D", listened: true },
  { artist: "The Necks", title: "Sex", year: 1989, genre: "Jazz", section: "Jazz", listened: false },
  { artist: "Aphex Twin", title: "Richard D. James Album", year: 1996, genre: "Electronic", section: "Electronic", listenOrder: 138, rank: 167, tier: "C", listened: true },
  { artist: "Chuck Person", title: "Eccojams Vol. 1", year: 2010, genre: "Electronic", section: "Electronic", priorListen: true, listened: false, group: "Daniel Lopatin" },
  { artist: "Oneohtrix Point Never", title: "Replica", year: 2011, genre: "Electronic", section: "Electronic", listenOrder: 39, rank: 128, tier: "B", listened: true, group: "Daniel Lopatin" },
  { artist: "Portishead", title: "Dummy", year: 1994, genre: "Electronic", section: "Electronic", listenOrder: 183, rank: 117, tier: "B", priorListen: true, listened: true },
  { artist: "Daft Punk", title: "Discovery", year: 2001, genre: "Electronic", section: "Electronic", priorListen: true, listened: false },
  { artist: "The Prodigy", title: "The Fat of the Land", year: 1997, genre: "Electronic", section: "Electronic", listened: false },
  { artist: "Crystal Castles", title: "Crystal Castles (II)", year: 2010, genre: "Electronic", section: "Electronic", listened: false },
  { artist: "Burial", title: "Untrue", year: 2007, genre: "Electronic", section: "Electronic", listenOrder: 108, rank: 152, tier: "C", listened: true },
  { artist: "Justice", title: "† [Cross]", year: 2007, genre: "Electronic", section: "Electronic", listenOrder: 168, rank: 102, tier: "B", listened: true },
  { artist: "Boards of Canada", title: "Geogaddi", year: 2002, genre: "Electronic", section: "Electronic", listenOrder: 173, rank: 145, tier: "C", listened: true },
  { artist: "DJ Sprinkles", title: "Midtown 120 Blues", year: 2008, genre: "Electronic", section: "Electronic", listenOrder: 147, rank: 93, tier: "B", listened: true },
  { artist: "The Caretaker", title: "An Empty Bliss Beyond This World", year: 2011, genre: "Electronic", section: "Electronic", listenOrder: 178, rank: 175, tier: "D", listened: true },
  { artist: "Merzbow", title: "Pulse Demon", year: 1996, genre: "Experimental", section: "Electronic", listened: false },
  { artist: "GAS", title: "Pop", year: 2000, genre: "Electronic", section: "Electronic", listenOrder: 89, rank: 184, tier: "D", listened: true },
  { artist: "Biosphere", title: "Substrata", year: 1997, genre: "Electronic", section: "Electronic", listenOrder: 69, rank: 179, tier: "D", listened: true },
  { artist: "Röyksopp", title: "Melody A.M.", year: 2001, genre: "Electronic", section: "Electronic", listened: false },
  { artist: "Sd Laika", title: "That's Harakiri", year: 2014, genre: "Electronic", section: "Electronic", listenOrder: 143, rank: 151, tier: "C", listened: true },
  { artist: "Massive Attack", title: "Mezzanine", year: 1998, genre: "Electronic", section: "Electronic", listenOrder: 35, rank: 84, tier: "B", priorListen: true, listened: true },
  { artist: "Moby", title: "Play", year: 1999, genre: "Electronic", section: "Electronic", listened: false },
  { artist: "Basic Channel", title: "BCD-2", year: 1995, genre: "Electronic", section: "Electronic", listened: false },
  { artist: "New Order", title: "Substance", year: 1987, genre: "Punk / Post-Punk", section: "Electronic", listenOrder: 54, rank: 55, tier: "A", listened: true },
  { artist: "Squarepusher", title: "Hard Normal Daddy", year: 1997, genre: "Electronic", section: "Electronic", listenOrder: 123, rank: 168, tier: "C", listened: true },
  { artist: "Blank Banshee", title: "Blank Banshee 0", year: 2012, genre: "Electronic", section: "Electronic", listenOrder: 29, rank: 194, tier: "D", listened: true },
  { artist: "Tim Hecker", title: "Ravedeath, 1972", year: 2011, genre: "Electronic", section: "Electronic", listenOrder: 44, rank: 101, tier: "B", listened: true },
  { artist: "Autechre", title: "Confield", year: 2001, genre: "Electronic", section: "Electronic", listened: false },
  { artist: "Ryoji Ikeda", title: "Dataplex", year: 2005, genre: "Electronic", section: "Electronic", listenOrder: 74, rank: 199, tier: "D", listened: true },
  { artist: "William Basinski", title: "The Disintegration Loops", year: 2002, genre: "Experimental", section: "Electronic", listenOrder: 211, rank: 171, tier: "C", priorListen: true, listened: true },
  { artist: "Danny Brown", title: "Atrocity Exhibition", year: 2016, genre: "Hip-Hop", section: "Hip-Hop", priorListen: true, listened: false },
  { artist: "De La Soul", title: "3 Feet High and Rising", year: 1989, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 124, rank: 191, tier: "D", priorListen: true, listened: true },
  { artist: "Travis Scott", title: "Rodeo", year: 2015, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 119, rank: 104, tier: "B", listened: true },
  { artist: "J Dilla", title: "Donuts", year: 2006, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 84, rank: 41, tier: "S", priorListen: true, listened: true },
  { artist: "DJ Shadow", title: "Endtroducing.....", year: 1996, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 129, rank: 59, tier: "A", priorListen: true, listened: true },
  { artist: "DJ Screw", title: "All Screwed Up, Vol. II", year: 1995, genre: "Hip-Hop", section: "Hip-Hop", listened: false },
  { artist: "OutKast", title: "Aquemini", year: 1998, genre: "Hip-Hop", section: "Hip-Hop", priorListen: true, listened: false },
  { artist: "Nas", title: "Illmatic", year: 1994, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 30, rank: 36, tier: "S", priorListen: true, listened: true },
  { artist: "Mos Def", title: "Black on Both Sides", year: 1999, genre: "Hip-Hop", section: "Hip-Hop", listened: false },
  { artist: "Wu-Tang Clan", title: "Enter the Wu-Tang (36 Chambers)", year: 1993, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 36, rank: 142, tier: "C", priorListen: true, listened: true },
  { artist: "Genius/GZA", title: "Liquid Swords", year: 1995, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 207, rank: 85, tier: "B", listened: true },
  { artist: "Ol' Dirty Bastard", title: "Return to the 36 Chambers", year: 1995, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 201, rank: 91, tier: "B", listened: true },
  { artist: "Ghostface Killah", title: "Supreme Clientele", year: 2000, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 184, rank: 173, tier: "C", listened: true },
  { artist: "Shabazz Palaces", title: "Black Up", year: 2011, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 55, rank: 208, tier: "F", listened: true },
  { artist: "Dälek", title: "From Filthy Tongue of Gods and Griots", year: 2002, genre: "Hip-Hop", section: "Hip-Hop", listened: false },
  { artist: "Dr. Dre", title: "The Chronic", year: 1992, genre: "Hip-Hop", section: "Hip-Hop", listened: false },
  { artist: "Madvillain", title: "Madvillainy", year: 2004, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 189, rank: 5, tier: "SS", priorListen: true, listened: true },
  { artist: "Deltron 3030", title: "Deltron 3030", year: 2000, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 23, rank: 127, tier: "B", listened: true },
  { artist: "Divine Styler", title: "Spiral Walls Containing Autumns of Light", year: 1992, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 164, rank: 209, tier: "F", listened: true },
  { artist: "Slick Rick", title: "The Great Adventures of Slick Rick", year: 1988, genre: "Hip-Hop", section: "Hip-Hop", listened: false },
  { artist: "cLOUDDEAD", title: "cLOUDDEAD", year: 2001, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 174, rank: 177, tier: "D", listened: true },
  { artist: "MF DOOM", title: "Mm..Food", year: 2004, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 139, rank: 42, tier: "A", listened: true },
  { artist: "Public Enemy", title: "Fear of a Black Planet", year: 1990, genre: "Hip-Hop", section: "Hip-Hop", listened: false },
  { artist: "Eric B. & Rakim", title: "Paid In Full", year: 1987, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 144, rank: 148, tier: "C", listened: true },
  { artist: "Quasimoto", title: "The Unseen", year: 2000, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 80, rank: 176, tier: "D", listened: true },
  { artist: "Three-6 Mafia", title: "Mystic Stylez", year: 1995, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 114, rank: 118, tier: "B", listened: true },
  { artist: "Kendrick Lamar", title: "good kid, m.A.A.d city", year: 2012, genre: "Hip-Hop", section: "Hip-Hop", listenOrder: 148, rank: 3, tier: "SS", priorListen: true, listened: true },
  { artist: "Megadeth", title: "Rust in Peace", year: 1990, genre: "Metal", section: "Metal", listenOrder: 65, rank: 163, tier: "C", listened: true },
  { artist: "Burzum", title: "Filosofem", year: 1996, genre: "Metal", section: "Metal", listenOrder: 40, rank: 124, tier: "B", listened: true },
  { artist: "Opeth", title: "Blackwater Park", year: 2001, genre: "Metal", section: "Metal", listened: false },
  { artist: "Slayer", title: "Show No Mercy", year: 1983, genre: "Metal", section: "Metal", listenOrder: 99, rank: 157, tier: "C", listened: true },
  { artist: "Morbid Angel", title: "Altars of Madness", year: 1989, genre: "Metal", section: "Metal", listened: false },
  { artist: "Type O Negative", title: "Slow, Deep and Hard", year: 1991, genre: "Metal", section: "Metal", listenOrder: 50, rank: 178, tier: "D", listened: true },
  { artist: "Earth", title: "Earth 2", year: 1993, genre: "Metal", section: "Metal", listened: false },
  { artist: "Boris", title: "Boris at Last -Feedbacker-", year: 2003, genre: "Metal", section: "Metal", listenOrder: 85, rank: 156, tier: "C", listened: true },
  { artist: "Bathory", title: "Blood Fire Death", year: 1988, genre: "Metal", section: "Metal", listenOrder: 60, rank: 126, tier: "B", listened: true },
  { artist: "Blasphemy", title: "Fallen Angel of Doom", year: 1990, genre: "Metal", section: "Metal", listened: false },
  { artist: "Metallica", title: "Master of Puppets", year: 1986, genre: "Metal", section: "Metal", listened: false },
  { artist: "Black Sabbath", title: "Black Sabbath", year: 1970, genre: "Metal", section: "Metal", listenOrder: 90, rank: 134, tier: "B", listened: true },
  { artist: "Death", title: "Human", year: 1991, genre: "Metal", section: "Metal", listened: false },
  { artist: "Sleep", title: "Dopesmoker", year: 2003, genre: "Metal", section: "Metal", listenOrder: 24, rank: 50, tier: "A", listened: true },
  { artist: "Agalloch", title: "The Mantle", year: 2002, genre: "Metal", section: "Metal", listenOrder: 45, rank: 57, tier: "A", listened: true },
  { artist: "Electric Wizard", title: "Dopethrone", year: 2000, genre: "Metal", section: "Metal", listened: false },
  { artist: "Portal", title: "Outrè", year: 2007, genre: "Metal", section: "Metal", listened: false },
  { artist: "Neurosis", title: "Through Silver in Blood", year: 1996, genre: "Metal", section: "Metal", listenOrder: 179, rank: 60, tier: "A", listened: true },
  { artist: "Paysage d'Hiver", title: "Paysage d'Hiver", year: 1999, genre: "Metal", section: "Metal", listenOrder: 169, rank: 147, tier: "C", listened: true },
  { artist: "Damaar", title: "Triumph Through Spears of Sacrilege", year: 2008, genre: "Metal", section: "Metal", listened: false },
  { artist: "System of a Down", title: "Toxicity", year: 2001, genre: "Metal", section: "Metal", listenOrder: 153, rank: 48, tier: "A", listened: true },
  { artist: "Weakling", title: "Dead as Dreams", year: 2000, genre: "Metal", section: "Metal", listenOrder: 109, rank: 79, tier: "A", listened: true },
  { artist: "Sunn O)))", title: "Black One", year: 2005, genre: "Metal", section: "Metal", listened: false },
  { artist: "Kyuss", title: "Welcome to Sky Valley", year: 1994, genre: "Metal", section: "Metal", listenOrder: 70, rank: 56, tier: "A", listened: true },
  { artist: "Jesu", title: "Jesu", year: 2004, genre: "Metal", section: "Metal", listenOrder: 104, rank: 155, tier: "C", listened: true },
  { artist: "Deafheaven", title: "Sunbather", year: 2013, genre: "Metal", section: "Metal", listened: false },
  { artist: "Liturgy", title: "Aesthethica", year: 2011, genre: "Metal", section: "Metal", listenOrder: 194, rank: 96, tier: "B", listened: true },
  { artist: "Cynic", title: "Focus", year: 1993, genre: "Metal", section: "Metal", listened: false },
  { artist: "Murmuüre", title: "Murmuüre", year: 2010, genre: "Metal", section: "Metal", listened: false },
  { artist: "Ulver", title: "Bergtatt", year: 1995, genre: "Metal", section: "Metal", listenOrder: 134, rank: 154, tier: "C", listened: true },
];

const TOTAL_LIST = ALBUMS.length;

const GENRE_COLORS = {
  "Jazz": "#E8A838",
  "Metal": "#C23B22",
  "Indie / Alt": "#5B8DBE",
  "Electronic": "#7B5EA7",
  "Experimental": "#3A8A6E",
  "Pop / Rock": "#D4726A",
  "Punk / Post-Punk": "#D97B2B",
  "Hip-Hop": "#4A7C59",
  "Folk / Singer-Songwriter": "#8B7355",
  "Prog": "#6E5494",
  "Industrial": "#8A4A4A",
};

const TIER_COLORS = {
  "SS": "#FF6B6B",
  "S": "#FFA06B",
  "A": "#FFD56B",
  "B": "#C8E66B",
  "C": "#6BE8A0",
  "D": "#6BC8FF",
  "F": "#B06BFF",
};

const TIER_ORDER = ["SS", "S", "A", "B", "C", "D", "F"];

const DECADE_COLORS = {
  "1950s": "#8B7355",
  "1960s": "#C23B22",
  "1970s": "#E8A838",
  "1980s": "#D97B2B",
  "1990s": "#5B8DBE",
  "2000s": "#7B5EA7",
  "2010s": "#3A8A6E",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a1a1a", border: "1px solid #333", padding: "8px 12px",
      fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#ccc",
    }}>
      <div style={{ color: "#fff", marginBottom: 2 }}>{label}</div>
      <div>{payload[0].value} album{payload[0].value !== 1 ? "s" : ""}</div>
    </div>
  );
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("year");
  const [sortDir, setSortDir] = useState("asc");
  const [genreFilter, setGenreFilter] = useState(null);
  const [decadeFilter, setDecadeFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const listenedCount = useMemo(() => ALBUMS.filter(a => a.listened).length, []);
  const priorCount = useMemo(() => ALBUMS.filter(a => a.priorListen).length, []);
  const newDiscoveryCount = useMemo(() => ALBUMS.filter(a => a.listened && !a.priorListen).length, []);
  const remainingCount = TOTAL_LIST - listenedCount;
  const pct = Math.round((listenedCount / TOTAL_LIST) * 100);

  const statusFiltered = useMemo(() => {
    if (statusFilter === "listened") return ALBUMS.filter(a => a.listened);
    if (statusFilter === "remaining") return ALBUMS.filter(a => !a.listened);
    return ALBUMS;
  }, [statusFilter]);

  const decadeData = useMemo(() => {
    const counts = {};
    statusFiltered.forEach(a => { const d = Math.floor(a.year / 10) * 10 + "s"; counts[d] = (counts[d] || 0) + 1; });
    return ["1950s","1960s","1970s","1980s","1990s","2000s","2010s"].map(name => ({ name, count: counts[name] || 0 }));
  }, [statusFiltered]);

  const yearData = useMemo(() => {
    const counts = {};
    statusFiltered.forEach(a => { counts[a.year] = (counts[a.year] || 0) + 1; });
    const result = [];
    for (let y = 1955; y <= 2018; y++) result.push({ year: y, count: counts[y] || 0 });
    return result;
  }, [statusFiltered]);

  const genreData = useMemo(() => {
    const counts = {};
    statusFiltered.forEach(a => { counts[a.genre] = (counts[a.genre] || 0) + 1; });
    return Object.entries(counts).sort(([,a],[,b]) => b - a).map(([name, value]) => ({ name, value }));
  }, [statusFiltered]);

  const artistData = useMemo(() => {
    const counts = {};
    statusFiltered.forEach(a => {
      const key = a.group || a.artist;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).filter(([,c]) => c >= 2).sort(([,a],[,b]) => b - a).map(([name, count]) => ({ name, count }));
  }, [statusFiltered]);

  const filtered = useMemo(() => {
    let arr = statusFiltered.map((a, i) => ({ ...a, _idx: i }));
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter(a =>
        a.artist.toLowerCase().includes(s) || a.title.toLowerCase().includes(s) ||
        String(a.year).includes(s) || a.genre.toLowerCase().includes(s)
      );
    }
    if (genreFilter) arr = arr.filter(a => a.genre === genreFilter);
    if (decadeFilter) { const dec = parseInt(decadeFilter); arr = arr.filter(a => a.year >= dec && a.year < dec + 10); }
    arr.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      // listenOrder: push undefined/missing to end
      if (sortCol === "listenOrder" || sortCol === "rank") {
        va = va || 9999;
        vb = vb || 9999;
      }
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      const aa = a.artist.toLowerCase(), bb = b.artist.toLowerCase();
      if (aa < bb) return -1;
      if (aa > bb) return 1;
      return a._idx - b._idx;
    });
    return arr;
  }, [search, sortCol, sortDir, genreFilter, decadeFilter, statusFiltered]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const clearFilters = () => { setGenreFilter(null); setDecadeFilter(null); setSearch(""); };
  const hasFilters = genreFilter || decadeFilter || search;

  const SECTIONS_ORDER = ["/mu/-core", "Modern", "Classics", "Jazz", "Electronic", "Hip-Hop", "Metal"];
  const sectionData = useMemo(() => {
    return SECTIONS_ORDER.map(sec => {
      const all = ALBUMS.filter(a => a.section === sec);
      const done = all.filter(a => a.listened).length;
      return { name: sec, total: all.length, done, pct: Math.round((done / all.length) * 100) };
    });
  }, []);

  const timelineDots = useMemo(() => {
    return statusFiltered.map((a, i) => ({ ...a, _idx: i })).sort((a, b) => a.year - b.year || a._idx - b._idx);
  }, [statusFiltered]);

  const heatmapData = useMemo(() => {
    const decades = ["1950s","1960s","1970s","1980s","1990s","2000s","2010s"];
    const genres = Object.keys(GENRE_COLORS);
    const grid = {};
    decades.forEach(d => { grid[d] = {}; genres.forEach(g => { grid[d][g] = 0; }); });
    statusFiltered.forEach(a => {
      const d = Math.floor(a.year / 10) * 10 + "s";
      if (grid[d] && a.genre in grid[d]) grid[d][a.genre]++;
    });
    return { decades, genres, grid };
  }, [statusFiltered]);

  // Tier distribution
  const tierData = useMemo(() => {
    return TIER_ORDER.map(t => ({
      name: t,
      count: ALBUMS.filter(a => a.tier === t).length,
    }));
  }, []);

  // Tier × Genre: average rank per genre (lower = better)
  const tierGenreData = useMemo(() => {
    const listened = ALBUMS.filter(a => a.listened && a.rank);
    const genreRanks = {};
    listened.forEach(a => {
      if (!genreRanks[a.genre]) genreRanks[a.genre] = [];
      genreRanks[a.genre].push(a.rank);
    });
    return Object.entries(genreRanks)
      .map(([genre, ranks]) => ({
        genre,
        avg: Math.round(ranks.reduce((s, r) => s + r, 0) / ranks.length),
        count: ranks.length,
        best: Math.min(...ranks),
        worst: Math.max(...ranks),
      }))
      .sort((a, b) => a.avg - b.avg);
  }, []);

  // Listen order vs rank correlation
  const correlationData = useMemo(() => {
    return ALBUMS.filter(a => a.listened && a.rank && a.listenOrder)
      .map(a => ({ ...a, x: a.listenOrder, y: a.rank }));
  }, []);

  const statusBtn = (val, label) => (
    <button onClick={() => setStatusFilter(val)} style={{
      background: statusFilter === val ? "#222" : "transparent",
      border: statusFilter === val ? "1px solid #444" : "1px solid #222",
      borderRadius: 3, color: statusFilter === val ? "#ccc" : "#555",
      fontSize: 11, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#e0e0e0", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", padding: 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div style={{ padding: "40px 32px 24px", borderBottom: "1px solid #1a1a1a", background: "linear-gradient(180deg, #111 0%, #0d0d0d 100%)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", color: "#fff", margin: 0, fontFamily: "'Space Mono', monospace" }}>/mu/ essentials</h1>
          <span style={{ fontSize: 13, color: "#555", letterSpacing: 1 }}>2018 LIST · ALBUM A DAY</span>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#777" }}>PROGRESS</span>
            <span style={{ fontSize: 12, color: "#999" }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>{listenedCount}</span>
              <span style={{ color: "#555" }}> / </span><span>{TOTAL_LIST}</span>
              <span style={{ color: "#555", marginLeft: 8 }}>({pct}%)</span>
            </span>
          </div>
          <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #5B8DBE 0%, #7B5EA7 50%, #E8A838 100%)", borderRadius: 3, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{remainingCount} albums remaining</div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 6 }}>
          {statusBtn("all", `All (${TOTAL_LIST})`)}
          {statusBtn("listened", `Listened (${listenedCount})`)}
          {statusBtn("remaining", `Remaining (${remainingCount})`)}
        </div>
      </div>

      <div style={{ padding: "24px 32px" }}>

        {/* Section Progress */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20, marginBottom: 32 }}>
          <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>Progress by Section</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {sectionData.map(s => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#999" }}>{s.name}</span>
                  <span style={{ fontSize: 10, color: "#555", fontVariantNumeric: "tabular-nums" }}>{s.done}/{s.total}</span>
                </div>
                <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${s.pct}%`, borderRadius: 2,
                    background: s.pct === 100 ? "#3A8A6E" : s.pct >= 75 ? "#5B8DBE" : s.pct >= 50 ? "#7B5EA7" : "#E8A838",
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20 }}>
            <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>By Decade</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={decadeData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "#222" }} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} cursor="pointer"
                  onClick={(d) => { const dec = d.name.replace("s",""); setDecadeFilter(decadeFilter === dec ? null : dec); }}>
                  {decadeData.map((d, i) => (
                    <Cell key={i} fill={DECADE_COLORS[d.name] || "#555"} opacity={decadeFilter && decadeFilter + "s" !== d.name ? 0.25 : 1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20 }}>
            <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>By Year</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={yearData} margin={{ left: -10, right: 4, top: 5, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: "#444", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "#222" }} tickLine={false} interval={9} tickFormatter={v => `'${String(v).slice(2)}`} />
                <YAxis tick={{ fill: "#444", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length || payload[0].value === 0) return null;
                  const albums = statusFiltered.filter(a => a.year === label);
                  return (
                    <div style={{ background: "#1a1a1a", border: "1px solid #333", padding: "8px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#ccc", maxWidth: 300, maxHeight: 400, overflowY: "auto" }}>
                      <div style={{ color: "#fff", marginBottom: 4 }}>{label} — {payload[0].value} album{payload[0].value !== 1 ? "s" : ""}</div>
                      {albums.map((a,i) => <div key={i} style={{ color: a.listened ? "#888" : "#555", fontSize: 10 }}>{a.listened ? "✓" : "○"} {a.artist} — {a.title}</div>)}
                    </div>
                  );
                }} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" radius={[1, 1, 0, 0]}>
                  {yearData.map((d, i) => {
                    const dec = Math.floor(d.year / 10) * 10 + "s";
                    return <Cell key={i} fill={DECADE_COLORS[dec] || "#555"} opacity={d.count ? 0.85 : 0.1} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20 }}>
            <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>Genre Distribution</h2>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ flex: "0 0 140px" }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={genreData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={1} strokeWidth={0} cursor="pointer"
                      onClick={(d) => setGenreFilter(genreFilter === d.name ? null : d.name)}>
                      {genreData.map((g, i) => <Cell key={i} fill={GENRE_COLORS[g.name] || "#555"} opacity={genreFilter && genreFilter !== g.name ? 0.2 : 1} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                {genreData.map(g => (
                  <div key={g.name} onClick={() => setGenreFilter(genreFilter === g.name ? null : g.name)}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", opacity: genreFilter && genreFilter !== g.name ? 0.3 : 1, transition: "opacity 0.15s" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 1, flexShrink: 0, background: GENRE_COLORS[g.name] || "#555" }} />
                    <span style={{ fontSize: 11, color: "#999", flex: 1 }}>{g.name}</span>
                    <span style={{ fontSize: 11, color: "#555", fontVariantNumeric: "tabular-nums" }}>{g.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20 }}>
            <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>Most Represented Artists</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {artistData.map(a => {
                const albums = statusFiltered.map((al, i) => ({ ...al, _idx: i })).filter(al => (al.group || al.artist) === a.name).sort((x, y) => x._idx - y._idx);
                const genre = albums[0]?.genre;
                const hasMultipleProjects = new Set(albums.map(al => al.artist)).size > 1;
                return (
                  <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 12, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{a.name}</span>
                      {hasMultipleProjects && (
                        <span style={{ fontSize: 9, color: "#555", display: "block", marginTop: 1 }}>
                          {[...new Set(albums.map(al => al.artist))].join(" · ")}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {albums.map((al, i) => (
                        <div key={i} style={{ width: 14, height: 14, borderRadius: 2, background: GENRE_COLORS[genre] || "#555", opacity: al.listened ? 0.8 : 0.2, border: al.listened ? "none" : "1px dashed #555", boxSizing: "border-box" }} title={`${al.artist} — ${al.title}`} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: "#555", width: 16, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{a.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Decade × Genre Heatmap */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20, marginBottom: 32, overflowX: "auto" }}>
          <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>Decade × Genre</h2>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ padding: "4px 8px", fontSize: 10, color: "#555", textAlign: "left", fontWeight: 400 }}></th>
                {heatmapData.decades.map(d => (
                  <th key={d} style={{ padding: "4px 6px", fontSize: 10, color: "#555", textAlign: "center", fontWeight: 400 }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.genres.filter(g => Object.values(heatmapData.grid).some(d => d[g] > 0)).map(g => (
                <tr key={g}>
                  <td style={{ padding: "4px 8px", fontSize: 10, color: GENRE_COLORS[g] || "#888", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 1, background: GENRE_COLORS[g] || "#555", flexShrink: 0 }} />
                      {g}
                    </span>
                  </td>
                  {heatmapData.decades.map(d => {
                    const count = heatmapData.grid[d][g];
                    const maxCount = Math.max(...Object.values(heatmapData.grid).map(dd => Math.max(...Object.values(dd))));
                    const intensity = count / maxCount;
                    return (
                      <td key={d} style={{ padding: "3px", textAlign: "center" }}>
                        <div style={{
                          width: "100%", height: 22, borderRadius: 2,
                          background: count > 0 ? GENRE_COLORS[g] || "#555" : "#161616",
                          opacity: count > 0 ? 0.2 + intensity * 0.7 : 0.3,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, color: count > 0 ? "#fff" : "#333",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {count > 0 ? count : ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tier Insights */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>

          {/* Tier Distribution */}
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20 }}>
            <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>Tier Distribution</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tierData.map(t => (
                <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 28, height: 20, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                    background: TIER_COLORS[t.name], fontSize: 10, fontWeight: 700, color: "#000", flexShrink: 0,
                  }}>{t.name}</span>
                  <div style={{ flex: 1, height: 16, background: "#1a1a1a", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                    {(() => {
                      const priorInTier = ALBUMS.filter(a => a.tier === t.name && a.priorListen).length;
                      const newInTier = t.count - priorInTier;
                      const priorPct = (priorInTier / 212) * 100;
                      const newPct = (newInTier / 212) * 100;
                      return (<>
                        <div style={{ position: "absolute", left: 0, height: "100%", width: `${priorPct + newPct}%`, background: TIER_COLORS[t.name], opacity: 0.6, borderRadius: 2 }} />
                        <div style={{ position: "absolute", left: 0, height: "100%", width: `${priorPct}%`, background: TIER_COLORS[t.name], opacity: 0.9, borderRadius: "2px 0 0 2px" }} />
                      </>);
                    })()}
                  </div>
                  <span style={{ fontSize: 11, color: "#555", width: 24, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{t.count}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 10, color: "#555" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#888", opacity: 0.9 }} /> Already knew ({priorCount} listened)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#888", opacity: 0.4 }} /> New discovery ({newDiscoveryCount})
                </span>
              </div>
            </div>
          </div>

          {/* Genre Rankings */}
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20 }}>
            <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: "0 0 16px", textTransform: "uppercase" }}>Average Rank by Genre</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {tierGenreData.map(g => {
                const tierForAvg = g.avg <= 13 ? "SS" : g.avg <= 41 ? "S" : g.avg <= 79 ? "A" : g.avg <= 135 ? "B" : g.avg <= 174 ? "C" : g.avg <= 199 ? "D" : "F";
                return (
                  <div key={g.genre} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: GENRE_COLORS[g.genre] || "#888", width: 100, flexShrink: 0 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 1, background: GENRE_COLORS[g.genre] || "#555", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {g.genre.replace("Folk / Singer-Songwriter", "Folk / S-S").replace("Punk / Post-Punk", "Punk / P-P")}
                      </span>
                    </span>
                    <div style={{ flex: 1, height: 12, background: "#1a1a1a", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                      <div style={{ position: "absolute", left: `${(g.best / 212) * 100}%`, width: `${((g.worst - g.best) / 212) * 100}%`, height: "100%", background: GENRE_COLORS[g.genre] || "#555", opacity: 0.2, borderRadius: 2 }} />
                      <div style={{ position: "absolute", left: `${(g.avg / 212) * 100}%`, top: 1, width: 2, height: 10, background: TIER_COLORS[tierForAvg], borderRadius: 1 }} />
                    </div>
                    <span style={{ fontSize: 10, color: "#666", width: 50, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>avg #{g.avg}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: 11, color: "#555", letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>
              All Albums
              {hasFilters && <span style={{ color: "#888", marginLeft: 8, letterSpacing: 0 }}>({filtered.length} shown)</span>}
            </h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {hasFilters && (
                <button onClick={clearFilters} style={{ background: "none", border: "1px solid #333", borderRadius: 3, color: "#888", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>Clear filters</button>
              )}
              <input type="text" placeholder="Search artists, albums, years..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: "#0d0d0d", border: "1px solid #222", borderRadius: 3, padding: "6px 12px", color: "#ccc", fontSize: 12, fontFamily: "inherit", width: 260, outline: "none" }} />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #222" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#555", fontWeight: 500, fontSize: 10, letterSpacing: 1.5, width: 20 }}></th>
                  {[{ key: "artist", label: "Artist" }, { key: "title", label: "Album" }, { key: "year", label: "Year" }, { key: "genre", label: "Genre" }, { key: "rank", label: "Rank" }, { key: "listenOrder", label: "Heard" }].map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)}
                      style={{ textAlign: "left", padding: "8px 12px", color: sortCol === col.key ? "#ccc" : "#555", fontWeight: 500, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}>
                      {col.label}{sortCol === col.key && <span style={{ marginLeft: 4, fontSize: 8 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #161616", transition: "background 0.1s", opacity: a.listened ? 1 : 0.5 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#161616"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "7px 12px", fontSize: 11, color: a.listened ? (a.priorListen ? "#5B8DBE" : "#3A8A6E") : "#333" }}>{a.listened ? (a.priorListen ? "★" : "✓") : "○"}</td>
                    <td style={{ padding: "7px 12px", color: "#ccc" }}>{a.artist}</td>
                    <td style={{ padding: "7px 12px", color: "#999" }}>{a.title}</td>
                    <td style={{ padding: "7px 12px", color: "#666", fontVariantNumeric: "tabular-nums" }}>{a.year}</td>
                    <td style={{ padding: "7px 12px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: GENRE_COLORS[a.genre] || "#666", fontSize: 11 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 1, background: GENRE_COLORS[a.genre] || "#555", flexShrink: 0 }} />
                        {a.genre}
                      </span>
                    </td>
                    <td style={{ padding: "7px 12px" }}>
                      {a.tier ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <span style={{
                            fontSize: 8, fontWeight: 700, padding: "1px 4px", borderRadius: 2,
                            background: TIER_COLORS[a.tier], color: "#000",
                          }}>{a.tier}</span>
                          <span style={{ fontSize: 10, color: "#555", fontVariantNumeric: "tabular-nums" }}>#{a.rank}</span>
                        </span>
                      ) : ""}
                    </td>
                    <td style={{ padding: "7px 12px", color: "#444", fontSize: 10, fontVariantNumeric: "tabular-nums" }}>{a.listenOrder || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "24px 0 40px", fontSize: 10, color: "#333" }}>
          /mu/ essentials 2018 (318 albums) · Tracked via RateYourMusic
        </div>
      </div>
    </div>
  );
}
