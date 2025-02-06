import { Request, Response, NextFunction } from 'express';
import puppeteer from 'puppeteer';
import Joi from 'joi';
import { RatedUser } from './model';
import AppError from '../../utils/AppError';


// Define schema for the problemsSaved
const ratedUserSchema = Joi.object({
    handle: Joi.string().required(),
    platform: Joi.string().required(),
    rating: Joi.number().required(),
});

// Define the schema for an array of rated users
const ratedUsersSchema = Joi.array().items(ratedUserSchema);

interface Users {
    platform: string, 
    handle: string,
    participations: string,
    rating: number,
    rank: string, 
};

const scrapeData = async (url: string) => {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(url);
        // scrape the table data
        const tableData = await page.$$eval('.datatable.ratingsDatatable table tr', (tds) =>
            tds.map((td) => {
                return td.innerText;
            })
        );

        const users: Users[] = [];
        tableData.forEach((data, idx) => {
            if(idx === 0) return;
            const [rank, handle, participations, ratingStr] = data.split('\t');
            const rating = parseInt(ratingStr);
            users.push({ platform: 'codeforces', handle, participations, rating, rank });
        });

        await browser.close();

        return users;
    } catch (error) {
        console.error('Error scraping data:', error);
    }
};

const insertData = async (pageNo: number) => {
    // fetch rated users from cf
    const url = `https://codeforces.com/ratings/page/${pageNo}`;
    
    const users = await scrapeData(url);

    if(!users || users.length === 0) {
        return;
    }

    const ratedUsers = users.map((user) => { 
        return { handle: user.handle, platform: user.platform, rating: user.rating };
    });

    // Validate the request body
    const { error, value } = ratedUsersSchema.validate(ratedUsers);
    if (error) {
        console.log(error);
        throw new AppError(error.details[0].message, 400);
    }
    
    // store them to mongo which later be used for task collection as per rating
    await RatedUser.insertMany(value);
    
};

const scrapperHandlers = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // delete all the existing rated users
            await RatedUser.deleteMany();
            
            // eslint-disable-next-line no-var
            var i=1; // page number & has global scope

            // call periodic task to scrap the data
            const taskInterval = setInterval(async () => {
                await insertData(i);
                console.log('Page:', i, ' Inserted!');
                i++;
                // iterate over first 100 the pages
                if(i == 3) clearInterval(taskInterval);
            }, 1000*60*2);
            
            
            // this api might be called monthly/15days

            return res.status(200).json({ message: 'Scrapped & Inserted' });
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    // post: async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         // Validate the request body
    //         const { error, value } = problemsSavedSchema.validate(req.body);
    //         if (error) {
    //             throw new AppError(error.details[0].message, 400);
    //         }
            
    //         // Create a new user
    //         const newProblem = new ProblemsSaved({...value});
    //         await newProblem.save();

    //         res.status(201).json(newProblem);
    //     } catch (error) {
    //         next(error);
    //     }
    // },
}

export default scrapperHandlers;