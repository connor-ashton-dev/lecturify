import React from "react";
import styles from "./summary.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryProps {
  result: string;
}

const fakeResult = `
<div>
  <h1>Brief Summary</h1>
  <p>Whales are large, ocean-dwelling mammals that are known for their size and unique blue coloration. They are considered to be one of the largest animal hunters in the world.</p>
</div>

<div>
  <h1>Notes</h1>
  <p>- Whales belong to the group of marine mammals, which means they give birth to live young and nurse their offspring with milk.</p>
  <p>- There are different species of whales, including the blue whale, which is the largest animal on Earth.</p>
  <p>- Whales are known to have a complex social structure and communicate with each other using a variety of sounds.</p>
  <p>- Some whale species, such as the killer whale, feed on other animals, while others, like the blue whale, filter-feed on tiny organisms such as krill.</p>
</div>

<div>
  <h1>Practice Questions</h1>
  <p>Question 1: What are some characteristic features of whales?</p>
  <p>A) They are small in size</p>
  <p>B) They are orange in color</p>
  <p>C) They are large and live in the ocean</p>
  <p>D) They are herbivores</p>
  <p>Answer: C</p>
</div>

<div>
  <p>Question 2: Which species of whale is the largest animal on Earth?</p>
  <p>A) Killer Whale</p>
  <p>B) Blue Whale</p>
  <p>C) Humpback Whale</p>
  <p>D) Sperm Whale</p>
  <p>Answer: B</p>
</div>

<div>
  <h1>Helpful Definitions</h1>
  <p>Whales: Large marine mammals that live in the ocean and are known for their size and blue coloration.</p>
  <p>Filter-feeding: A feeding method where an animal, such as a whale, filters small organisms or particles from water or other medium.</p>
</div>

`;

const Summary = ({ result }: SummaryProps) => {
  return (
    <div>
      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-500 font-bold">
              Note Title
            </CardTitle>
            <CardDescription>Class Name</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={styles.summaryDiv}
              dangerouslySetInnerHTML={{ __html: result }}
            />
          </CardContent>
          {/* <CardFooter> */}
          {/*   <p>Card Footer</p> */}
          {/* </CardFooter> */}
        </Card>
      ) : (
        <div>Press record to start recording...</div>
      )}
    </div>
  );
};

export default Summary;
