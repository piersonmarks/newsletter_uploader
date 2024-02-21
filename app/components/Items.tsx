"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabase";
import {
  NextUIProvider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Link,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";

// Human readable date
const getDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const prices = ["FREE", "FREEMIUM", "PAID"];
const frequencies = ["daily", "weekly", "monthly"];

const Item = ({ item, setNewItem }) => {
  // Assuming this is inside your component
  const [description, setDescription] = useState(item.description);
  const [shortDescription, setShortDescription] = useState("");
  const [pricing, setPricing] = useState(item.pricing);
  const [frequency, setFrequency] = useState(item.frequency);
  const [categories, setCategories] = useState(item.categories);
  const [newCategory, setNewCategory] = useState("");
  const [url, setUrl] = useState(item.url);
  const [similarNewslettersList, setSimilarNewslettersList] = useState([]);
  const [selectedSimiliarNewsletterIds, setSelectedSimiliarNewsletterIds] =
    useState([]);

  // create item from the state
  useEffect(() => {
    const selectedSimiliarNewsletters = similarNewslettersList.filter(
      (newsletter) => selectedSimiliarNewsletterIds.includes(newsletter.id)
    );

    const newItem = {
      title: item.title,
      description,
      shortDescription,
      pricing,
      frequency,
      categories,
      url,
      ogImage: item.ogImage,
      slug: item.slug,
      similarNewslettersList: selectedSimiliarNewsletters,
    };
    setNewItem(newItem);
  }, [
    description,
    shortDescription,
    pricing,
    frequency,
    categories,
    url,
    item.title,
    item.ogImage,
    item.slug,
    setNewItem,
    similarNewslettersList,
    selectedSimiliarNewsletterIds,
  ]);

  const handleDelete = (categoryToDelete) => {
    setCategories(
      categories.filter((category) => category !== categoryToDelete)
    );
  };

  const handleAdd = async () => {
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const handleNewCategoryChange = async (event) => {
    setNewCategory(event.target.value);
  };

  useEffect(() => {
    const fetchSimiliarNewsletters = async () => {
      console.log("Fetching similar newsletters");
      // make lowercase
      const lowerCaseCategories = categories.map((category) =>
        category.toLowerCase()
      );

      const { data, error } = await supabase.from("Newsletters").select();

      if (error || !data) {
        console.error("Error fetching similar newsletters", error);
        return;
      }

      const filteredData = data.filter((newsletter) =>
        newsletter.categories.some((category) =>
          lowerCaseCategories.includes(category)
        )
      );

      // If there are similar newsletters, sort based on the number of categories that match
      console.log("Similar newsletters fetched successfully", filteredData);
      let similarNewsletters = [];
      if (filteredData && filteredData.length > 0) {
        similarNewsletters = filteredData
          .map((newsletter) => {
            const matches = newsletter.categories.filter((category) =>
              lowerCaseCategories.includes(category)
            );
            return { ...newsletter, matches };
          })
          .sort((a, b) => b.matches.length - a.matches.length);
      }
      setSimilarNewslettersList(similarNewsletters);
    };

    // Fetch the similar newsletters
    fetchSimiliarNewsletters();
  }, [categories]);

  useEffect(() => {
    setDescription(item.description);
    setShortDescription("");
    setPricing(item.pricing);
    setFrequency(item.frequency);
    setCategories(item.categories);
    setUrl(item.url);
  }, [item]);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onGenerateShortDescription = () => {
    console.log("Generating Short Description");
    // Call the AI function to generate short description
    const shortDescriptionResult = "AI Generated Short Description";
    setShortDescription(shortDescriptionResult);
  };

  const onShortDescriptionChange = (e) => {
    setShortDescription(e.target.value);
  };

  const handlePricingChange = (event) => {
    setPricing(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="max-w-4xl p-4 bg-gray-100 rounded-lg shadow px-8 py-4">
        <Image
          src={item.ogImage}
          alt={item.title}
          className="w-full h-auto rounded"
          width={500}
          height={300}
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="text-xs mt-1 italic">
            Submitted at: {getDate(item.created_at)}
          </p>
          <p className="text-xs mt-1 italic">
            {item.firstName} {item.lastName} ({item.email})
          </p>
          <p className="text-sm mt-4">Description: </p>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="mt-2 w-full p-4 text-sm text-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-1 shadow-sm bg-gray-50 hover:bg-white focus:outline-none"
          />

          <button
            className="text-xs my-2 px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 min-w-32 font-semibold focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onGenerateShortDescription}
            disabled={true}
          >
            Generate Short Description with AI (Work In Progress)
          </button>
          <p className="text-sm mt-4">Short Description:</p>
          <textarea
            className="mt-2 w-full p-4 text-sm text-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 block mt-1 shadow-sm bg-gray-50 hover:bg-white focus:outline-none"
            onChange={onShortDescriptionChange}
            value={shortDescription}
          />

          {/* Display other details */}
          <div className="mt-4 mb-8">
            <p className="text-sm">Price:</p>
            <select
              className="py-1 text-sm font-semibold text-blue-800 bg-blue-200 rounded-md"
              value={pricing}
              onChange={handlePricingChange}
            >
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 mb-8">
            <p className="text-sm">Frequency:</p>
            <select
              className="py-1 text-sm font-semibold text-purple-800 bg-purple-200 rounded-md"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              {frequencies.map((freq) => (
                <option key={freq} value={freq}>
                  {freq.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm mt-4">Categories (Max 3):</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(category)}
                  className="px-3 py-1 text-sm text-gray-800 bg-gray-200 rounded-full"
                >
                  {category}{" "}
                  <span className="text-xs font-medium ml-2 inline-flex items-center justify-center border border-transparent rounded-full bg-gray-500 text-white h-4 w-4">
                    x
                  </span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-row items-center justify-center">
            <input
              value={newCategory}
              onChange={handleNewCategoryChange}
              placeholder="New category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              onClick={handleAdd}
              className="ml-2 min-w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={categories.length >= 3 || newCategory === ""}
            >
              Add
            </button>
          </div>
          {/* Similar Newsletters (TODO: Replace with AI)*/}
          <div className="mt-4">
            <p className="text-sm font-semibold">
              Similar Newsletters (Based on Categories):
            </p>
            <p className="text-xs">
              You can select as many as you want. Only 5 max will be shown to
              the user.
            </p>
            <div
              className="mt-4 overflow-auto max-h-64 bg-white rounded-md p-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #eee" }}
            >
              <ul>
                {similarNewslettersList.length === 0 && (
                  <p className="italic text-xs">
                    No similar newsletters found.
                  </p>
                )}
                <CheckboxGroup
                  color="secondary"
                  value={selectedSimiliarNewsletterIds}
                  onValueChange={setSelectedSimiliarNewsletterIds}
                >
                  {similarNewslettersList.map((newsletter: any) => (
                    <li key={newsletter.id} className="mb-4">
                      <Checkbox value={newsletter.id}>
                        <p className="text-md font-semibold mb-1 ">
                          {newsletter.title}{" "}
                          <span>({newsletter.categories.join(", ")})</span>
                        </p>
                        <p className="text-sm italic">
                          {newsletter.description}
                        </p>
                      </Checkbox>
                    </li>
                  ))}
                </CheckboxGroup>
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <iframe
              src={url}
              className="w-full h-96 mt-4"
              title="Newsletter Submission"
            />
            <p className="italic">
              Subscription Website:{" "}
              <Link href={url} isExternal className="hover:underline">
                {url}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// On Reject: Set the item in the DB to rejected
// On Approve: Pop up a confirmation modal, fetch the related newsletters from the DB, then upload

const fetchData = async () => {
  const { data, error } = await supabase
    .from("NewsletterSubmissions")
    .select("*")
    .eq("rejected", false)
    .eq("uploaded", false);
  if (error) {
    console.error("Error fetching newsletter submissions", error);
  } else {
    console.log("Newsletter submissions fetched successfully");
    return data;
  }
};

export const Items = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [newItem, setNewItem] = useState<any>({});

  useEffect(() => {
    (async () => {
      const data = await fetchData();
      if (data) {
        setData(data);
      }
    })();
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-center">
          No newsletter submissions to review
        </h2>
        <p className="mt-2 text-center">
          There are no newsletter submissions to review at the moment.
        </p>
      </div>
    );
  }

  const currentItem = data[currentIndex];

  const onApprove = async () => {
    // Fetch the related newsletters from the DB based on the categories
    onOpen();
  };

  // Upload the new item to the Newsletters table
  const onSubmit = async (onClose: any) => {
    try {
      // convert the similiar newsletters to an array of ids
      const relatedNewsletterIds = newItem.similarNewslettersList.map(
        (newsletter) => newsletter.id
      );

      // Convert the description to an array split by new lines
      const description = newItem.description.split("\n");

      const categories = newItem.categories.map((category) =>
        category.toLowerCase()
      );

      const itemToUpload = {
        title: newItem.title,
        description: description,
        shortDescription: newItem.shortDescription,
        price: newItem.pricing,
        frequency: newItem.frequency,
        categories: categories,
        url: newItem.url,
        ogImage: newItem.ogImage,
        slug: newItem.slug,
        relatedNewsletterIds: relatedNewsletterIds,
      };

      console.log("Uploading newsletter", itemToUpload);

      const { data, error } = await supabase
        .from("Newsletters")
        .insert([itemToUpload])
        .select();

      console.log("Data", data);
      if (error) {
        console.error("Error uploading newsletter", error);
        throw new Error("Error uploading newsletter");
      }

      const newNewsletterId = data[0].id;

      // Update the related newsletters in the NewsletterSubmissions table, adding this newsletter id to their relatedNewsletterIds array
      if (relatedNewsletterIds.length > 0) {
        // For each related newsletter id, update it in the Newsletters table
        for (const id of relatedNewsletterIds) {
          // Retrieve the current relatedNewsletterIds for the newsletter
          let { data: newsletterData, error: fetchError } = await supabase
            .from("Newsletters")
            .select("relatedNewsletterIds")
            .eq("id", id)
            .single();
          if (fetchError || !newsletterData) {
            console.error("Error fetching newsletter data", fetchError);
            throw new Error("Error fetching newsletter data");
          }

          const updatedRelatedNewsletterIds = [
            ...(newsletterData.relatedNewsletterIds || []),
            newNewsletterId,
          ];

          console.log(
            "Updating related newsletters",
            updatedRelatedNewsletterIds
          );

          // Update the newsletter with the new array
          const { error: updateError } = await supabase
            .from("Newsletters")
            .update({ relatedNewsletterIds: updatedRelatedNewsletterIds })
            .eq("id", id);

          if (updateError) {
            console.error("Error updating related newsletters", updateError);
            throw new Error("Error updating related newsletters");
          }
        }
      }

      // Set the current item to uploaded in the NewsletterSubmissions table
      const { error: submissionError } = await supabase
        .from("NewsletterSubmissions")
        .update({ uploaded: true })
        .eq("id", currentItem.id);

      if (submissionError) {
        throw new Error("Error updating newsletter submission");
      }

      // Refresh Data
      const submissionData = await fetchData();
      if (submissionData) {
        setData(submissionData);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error uploading newsletter", error);
    }
  };

  return (
    <NextUIProvider>
      <div>
        <div>
          <Item item={currentItem} setNewItem={setNewItem} />
          <div className="w-full">
            <div className="flex gap-4 mt-8 mx-auto text-center justify-center align-center">
              <button
                onClick={() =>
                  setCurrentIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : data.length - 1
                  )
                }
                className="px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-400 min-w-32 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={data.length === 1}
              >
                Back
              </button>
              <button
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from("NewsletterSubmissions")
                      .update({ rejected: true })
                      .eq("id", currentItem.id);
                    if (error) {
                      console.error(
                        "Error updating newsletter submission",
                        error
                      );
                    } else {
                      console.log("Newsletter submission updated successfully");
                      setData((prevData) =>
                        prevData.filter((item) => item.id !== currentItem.id)
                      );
                    }
                  } catch (error) {
                    console.error(
                      "Error updating newsletter submission",
                      error
                    );
                  }
                }}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 min-w-32 font-semibold"
              >
                Reject
              </button>
              <button
                onClick={onApprove}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 min-w-32 font-semibold"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length)
                }
                className="px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-400 min-w-32 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={data.length === 1}
              >
                Skip
              </button>
            </div>
          </div>
          <p className="text-sm mt-2 text-center">
            Item: {currentIndex + 1} of {data.length}
          </p>
          <p className="text-sm mt-2 text-center opacity-70 italic">
            If you accidentally reject a submission, go to Supabase and reset
            the &quot;rejected&quot; column to false.
          </p>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col ">
                  Confirm Submission
                </ModalHeader>
                <ModalBody>
                  {/* Put all the info from the new item here */}
                  <Image
                    src={newItem.ogImage}
                    alt="OG Image"
                    width={500}
                    height={300}
                  />
                  <p className="text-sm ">
                    <span className="font-semibold">Title:</span>{" "}
                    {newItem.title}
                  </p>
                  <p className="text-sm font-semibold"> Description:</p>
                  <p className="text-sm">{newItem.description}</p>
                  <p className="text-sm font-semibold">Short Description:</p>
                  <p className="text-sm">{newItem.shortDescription}</p>

                  <p className="text-sm mt-2">Pricing: {newItem.pricing}</p>
                  <p className="text-sm">Frequency: {newItem.frequency}</p>
                  <p className="text-sm">
                    Categories:{" "}
                    {newItem.categories.length > 0 ? (
                      newItem.categories.join(", ")
                    ) : (
                      <span className="text-red-500">No categories</span>
                    )}
                  </p>
                  <p className="text-sm">
                    Subscribe Link:{" "}
                    <Link isExternal href={newItem.url} className="text-sm">
                      {newItem.url}
                    </Link>
                  </p>
                  <p className="text-sm">Slug: /{newItem.slug}</p>
                  {/* Similiar Newsletters */}
                  <p className="text-sm mt-4">Similar Newsletters:</p>
                  {newItem.similarNewslettersList.length === 0 && (
                    <p className="italic text-xs text-warning-400">
                      No similar newsletters.
                    </p>
                  )}
                  <ul>
                    {newItem.similarNewslettersList &&
                      newItem.similarNewslettersList.map((newsletter) => (
                        <li key={newsletter.id}>
                          <p className="text-md font-semibold mb-1 ">
                            {newsletter.title}{" "}
                            <span>({newsletter.categories.join(", ")})</span>
                          </p>
                          <p className="text-sm italic">
                            {newsletter.shortDescription}
                          </p>
                        </li>
                      ))}
                  </ul>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={() => onSubmit(onClose)}>
                    Confirm Submission
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </NextUIProvider>
  );
};
