import React, { Fragment, useRef, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import TagInput from "../TagInput/TagInput";

// Add a Post Modal Component
const Modal = ({ open, closeModal, userInfo }) => {
  // file picker ref
  const filePickRef = useRef(null);
  // selected file state
  const [selectedFile, setSelectedFile] = useState(null);
  // caption ref
  const captionRef = useRef(null);
  // loading state
  const [loading, setLoading] = useState(false);
  // suggestions state
  const [suggestions, setSuggestions] = useState([]);
  // show suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  // caption input value state
  const [captionValue, setCaptionValue] = useState("");

  // cation input change handler
  const handleCaptionInputChange = (e) => {
    const value = e.target.value;
    setCaptionValue(value);
    // if not following anyone return
    if (!userInfo?.following || userInfo?.following?.length === 0) {
      return setShowSuggestions(false);
    }

    // if detetcs a @ in input
    if (value.includes("@")) {
      const searchText = value.split("@")[1];
      // getting suggested usernames from the following of user
      const filteredSuggestions = userInfo?.following.filter((person) =>
        person.username.toLowerCase().includes(searchText.toLowerCase())
      );
      // set suggestion
      // set show suggestions
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      // else do not show suggestions
      setShowSuggestions(false);
    }
  };

  // handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    //  update caption value with sugestion click
    setCaptionValue(captionValue + `${suggestion} `);
    // close suggestion
    setShowSuggestions(false);
    // ficus on caption input
    captionRef.current.focus();
  };

  // change handler func. for file input
  const addImage = (e) => {
    // file reader to read selected file and convert to string URL
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    // set seletcted file
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  // func. to handle submitting post to DB
  const postUpload = async () => {
    // if loading return
    if (loading) return;
    // loading to true
    setLoading(true);
    // unique file name for each file uploaded
    var ts = String(new Date().getTime()),
      i = 0,
      out = "";

    for (i = 0; i < ts.length; i += 2) {
      out += Number(ts.substring(i, 2)).toString(36);
    }
    var fileName = `postImage/${out}`;
    // create a storage ref and save the image
    const storageReference = ref(storage, `posts/${userInfo.uid}/${fileName}`);
    // get the downloaded link from firebase
    // firebase func.
    await uploadString(storageReference, selectedFile, "data_url")
      .then(async (snapshot) => {
        // firbase func. returns downloadURL
        const downloadUrl = await getDownloadURL(storageReference);
        // add doc. to users POST collection
        await addDoc(collection(db, "Users", userInfo?.uid, "Posts"), {
          timestamp: serverTimestamp(),
          caption: captionValue,
          postImage: downloadUrl,
          likes: 0,
          comments: 0,
          username: userInfo?.username,
          userImage: userInfo?.userImage || "",
          uid: userInfo?.uid,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // once post is uploaded close the modal
    // selcted file to null
    // loading to false
    closeModal();
    setSelectedFile(null);
    setLoading(false);
  };

  return (
    // headless ui react Dialog and Transition component for a smooth Dialog
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="flex items-end justify-center min-h-[700px] sm:min-h-screen px-5 pb-24 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* trick to center elements on screen */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 py-5 text-left overflow-hidden shadow-xl transition-all transform sm:my-10 sm:align-middle sm:max-w-sm sm:w-full">
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    alt="selected-post"
                    onClick={() => setSelectedFile(null)}
                    className="w-full max-h-[150px] object-contain cursor-pointer"
                  />
                ) : (
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer mx-auto"
                    onClick={() =>
                      filePickRef.current.dispatchEvent(new MouseEvent("click"))
                    }
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div>
                  <div className="mt-4 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-semibold text-gray-700"
                    >
                      Upload a Photo
                    </Dialog.Title>

                    <div>
                      <input
                        type="file"
                        hidden
                        ref={filePickRef}
                        onChange={addImage}
                      />
                    </div>

                    <div className="mt-2 relative">
                      <input
                        type="text"
                        placeholder="Enter a caption"
                        className="outline-none border-none focus:ring-0 w-full text-center"
                        ref={captionRef}
                        value={captionValue}
                        onChange={handleCaptionInputChange}
                      />

                      {showSuggestions && (
                        // custom component to show suggestions
                        <TagInput
                          suggestions={suggestions}
                          handleSuggestionClick={handleSuggestionClick}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* upload button */}
                <div className="mt-5 sm:mt-8">
                  <button
                    type="submit"
                    disabled={!selectedFile}
                    onClick={postUpload}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-red-300 text-white text-base font-semibold hover:bg-red-800 hover:scale-105 focus:outline-none focus:ring-offset-2 focus:ring-red-500 focus:ring-2 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                  >
                    {loading ? "Uploading..." : "Upload Post"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
