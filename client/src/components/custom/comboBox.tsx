"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLectureStore, userStore } from "@/utils/store";
import axios from "axios";
import { Input } from "../ui/input";
import { User } from "@prisma/client";

type OptionType = {
  id: string;
  value: string;
  label: string;
};

export function ComboBox() {
  const [open, setOpen] = React.useState(false);
  const [classChosen, setClassChosen] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [filteredOptions, setFilteredOptions] = React.useState<OptionType[]>(
    []
  );

  const { classTitle, setClass, setClassId } = useLectureStore((state) => {
    return {
      classTitle: state.class,
      setClass: state.changeClass,
      setClassId: state.changeClassId,
    };
  });

  const { user } = userStore((state) => {
    return {
      user: state.user,
    };
  });

  React.useEffect(() => {
    if (user) {
      getClasses(user);
    } else {
      console.error("user is null in teh getClasses useEffect");
    }
  }, [user]);

  // Create a unique key based on the current time and filteredOptions length
  const [uniqueKey, setUniqueKey] = React.useState(Date.now());

  React.useEffect(() => {
    // Update the unique key to force a re-render of motion.div elements
    setUniqueKey(Date.now());
  }, [filteredOptions]);

  React.useEffect(() => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(classTitle.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [classTitle, options]);

  const addClass = async () => {
    if (user) {
      setLoading(true);
      const res = await axios.post("/api/classes/create", {
        title: classTitle,
        user: user,
      });
      if (res.status === 200) {
        //wait 2 seconds
        setLoading(false);
        const newOption: OptionType = {
          value: classTitle,
          label: classTitle,
          id: res.data.result.id,
        };
        setFilteredOptions((prevOptions) => [...prevOptions, newOption]);
        setClassChosen(newOption.label);
        setClass(newOption.label);
        setClassId(newOption.id);
      }
    } else {
      console.error("a mysterious error occured in the addClass function");
      console.log("user: ", user);
    }
  };

  const getClasses = async (user: User) => {
    const res = await axios.post("/api/classes/getClasses", {
      userId: user.id,
    });
    if (res.status === 200) {
      const classes = res.data.result.classes;
      const myOptions: OptionType[] = [];
      classes.forEach((c: any) => {
        const option: OptionType = {
          value: c.title,
          label: c.title,
          id: c.id,
        };
        myOptions.push(option);
      });
      setOptions(myOptions);
    }
  };

  return (
    <div>
      <Input
        placeholder="Search for your class ..."
        onChange={(e) => {
          setClassChosen("");
          setClass(e.target.value);
        }}
        value={classTitle}
      />
      {!classChosen &&
        classTitle.length > 0 &&
        (filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <motion.div
              className="py-1"
              key={`${option.label}-${uniqueKey}`} // Use the unique key here
              initial={{ opacity: 0 }} // Start with 0 opacity
              animate={{ opacity: 1 }} // Animate to full opacity
              transition={{
                duration: 0.5, // Duration of the animation
              }}
            >
              <Button
                onClick={() => {
                  setClassChosen(option.label);
                  setClass(option.label);
                  setClassId(option.id);
                }}
              >
                {option.label}
              </Button>
            </motion.div>
          ))
        ) : (
          <AlertDialog>
            <AlertDialogTrigger>
              {!loading ? (
                <Button>Create new class</Button>
              ) : (
                <Button disabled>Creating your class</Button>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Create a new class with name: {classTitle}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will add a class to your list of classes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={addClass}>Create</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
    </div>
  );
}
