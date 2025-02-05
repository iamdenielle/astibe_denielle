import fs from "fs";
import inquirer from "inquirer";
import sillyname from "sillyname";
import superheroes from "superheroes";
import qr from "qr-image";
import chalk from "chalk";

async function main() {
    try {
        // Get user's name
        const { username } = await inquirer.prompt([
            {
                type: "input",
                name: "username",
                message: "What is your name?",
            },
        ]);

        console.log(chalk.green(`Hello, ${chalk.bold(username)}!`));

        // Generate silly and superhero names
        const villainName = sillyname();
        const heroNames = superheroes.all || [];
        const heroName = heroNames.length > 0 ? heroNames[Math.floor(Math.random() * heroNames.length)] : "Unknown Hero";

        console.log(chalk.red(`Your villain name: ${chalk.bold(villainName)}`));
        console.log(chalk.blue(`Your superhero name: ${chalk.bold(heroName)}`));

        // Generate QR codes
        const qrCodes = {
            name: qr.image(username, { type: "png" }),
            villain: qr.image(villainName, { type: "png" }),
            hero: qr.image(heroName, { type: "png" })
        };

        // Save QR code images with error handling
        for (const [key, qrStream] of Object.entries(qrCodes)) {
            const filename = `${key}.png`;
            const writeStream = fs.createWriteStream(filename);
            qrStream.pipe(writeStream);
            writeStream.on("finish", () => console.log(chalk.yellow(`QR code saved: ${filename}`)));
        }

        // Write data to myhero.txt
        const data = `Name: ${username}\nVillain Name: ${villainName}\nSuperhero Name: ${heroName}\n\n`;
        fs.appendFileSync("myhero.txt", data, "utf8");
        console.log(chalk.magenta("Text file updated successfully!"));
    } catch (error) {
        console.error(chalk.red("An error occurred:"), error);
    }
}

main();
