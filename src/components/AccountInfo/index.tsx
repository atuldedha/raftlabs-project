import { UserCircleIcon } from "@heroicons/react/24/outline";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { CommonState } from "../../../typings";

type AccountInfoProps = {
  userInfo: CommonState;
  updateUser: ({}) => any;
};

const AccountInfo = ({ userInfo, updateUser }: AccountInfoProps) => {
  // image ref state
  const imageRef = useRef<any>(null);
  // selected image file state
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // state to open or close text area for bio
  const [openMessage, setOpenMessageArea] = useState(false);
  // state for bio message
  const [statusMessage, setStatusMessage] = useState(userInfo?.status || "");

  // state to check whether image uploaded or not
  const [profileUploading, setProfileUploading] = useState(false);
  // state to check whether bio uploaded or not
  const [statusUpdating, setStatusUpadting] = useState(false);
  // following and followers state
  const [following, setFollowing] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FileReader to read image as a dataURL
    const reader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      reader.readAsDataURL(file);
    }
    // when converted to url set the selected file
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent?.target?.result);
    };
  };

  // save image click handler func.
  const saveProfileImage = async (e: React.MouseEvent) => {
    // if image upload is in process: return
    if (profileUploading) return;
    e.preventDefault();

    // setting image uploading to true
    setProfileUploading(true);
    // storage ref from firebase
    const storageReference = ref(storage, `posts/${userInfo.uid}/profilePhoto`);
    // upload func. from firebase
    let downloadUrl: string = "";
    await uploadString(storageReference, selectedFile, "data_url")
      .then(async (snapshot) => {
        downloadUrl = await getDownloadURL(storageReference);
        await updateDoc(doc(db, "Users", userInfo?.uid), {
          userImage: downloadUrl,
        });
        // when uploading done update context
        updateUser({ ...userInfo, userImage: downloadUrl });
      })
      .catch((err) => {
        console.log(err);
      });
    // set selected file to null once image uploaded
    // set profile uploading to false once image uploaded
    setSelectedFile(null);
    setProfileUploading(false);

    // changing image in each post collection after changing in profile
    getDocs(collection(db, "Users", userInfo?.uid, "Posts")).then(
      (documents) => {
        documents.docs.forEach((document) => {
          updateDoc(doc(db, "Users", userInfo?.uid, "Posts", document.id), {
            userImage: downloadUrl,
          });
        });
      }
    );

    // changing image in each post comment collection after changing in profile
    getDocs(collection(db, "Users", userInfo?.uid, "Posts")).then(
      (documents) => {
        documents.docs.forEach((document) => {
          getDocs(
            collection(
              db,
              "Users",
              userInfo?.uid,
              "Posts",
              document.id,
              "Comments"
            )
          ).then((documents2) => {
            documents2?.docs?.forEach((document2) => {
              if (document2?.data()?.commentedUsername === userInfo?.username) {
                updateDoc(
                  doc(
                    db,
                    "Users",
                    userInfo?.uid,
                    "Posts",
                    document.id,
                    "Comments",
                    document2.id
                  ),
                  {
                    commentedUserImage: downloadUrl,
                  }
                );
              }
            });
          });
        });
      }
    );

    // updating profile photo in each photo of the following person comment
    userInfo?.following?.forEach((data) => {
      getDocs(collection(db, "Users", data.uid, "Posts")).then((documents) => {
        documents?.docs?.forEach((document) => {
          getDocs(
            collection(db, "Users", data.uid, "Posts", document.id, "Comments")
          ).then((documents2) => {
            documents2?.docs?.forEach((document2) => {
              if (document2?.data()?.commentedUsername === userInfo?.username) {
                updateDoc(
                  doc(
                    db,
                    "Users",
                    data.uid,
                    "Posts",
                    document.id,
                    "Comments",
                    document2.id
                  ),
                  {
                    commentedUserImage: downloadUrl,
                  }
                );
              }
            });
          });
        });
      });
    });
  };

  // save status click handler
  const saveStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // if status is updating: return
    if (statusUpdating) return;
    e.preventDefault();
    // setting update state to true
    setStatusUpadting(true);
    // await documnet to be uploaded: firebase func.
    await updateDoc(doc(db, "Users", userInfo?.uid), {
      status: statusMessage,
    });
    // once updated
    // update context
    updateUser({ ...userInfo, status: statusMessage });
    // // set open test area state to false once status updated
    // set status updating to false once status updated
    setStatusUpadting(false);
    setOpenMessageArea(false);
  };

  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      const unSub1 = onSnapshot(
        collection(db, "Users", userInfo?.uid, "Followers"),
        (snapshots) => {
          setFollowers(snapshots.docs.length);
        }
      );

      const unSub2 = onSnapshot(
        collection(db, "Users", userInfo?.uid, "Following"),
        (snapshots) => {
          setFollowing(snapshots.docs.length);
        }
      );

      return () => {
        unSub1();
        unSub2();
      };
    }
  }, []);

  return (
    <div className="flex items-start mt-10 bg-gray-50 shadow-md rounded-md w-1/2 px-5 py-4">
      {/* left */}
      <div className="flex flex-col space-y-1 lg:basis-1/2">
        {selectedFile ? (
          <div className="flex flex-col space-y-2">
            <img
              src={selectedFile}
              alt="selected-post"
              className="h-14 w-14 object-cover rounded-full"
              onClick={() =>
                imageRef?.current?.dispatchEvent(new MouseEvent("click"))
              }
            />
            <div className="flex items-center space-x-2">
              <button
                className="bg-red-600 px-4 py-2 text-sm font-bold text-white rounded-lg disabled:bg-gray-200"
                disabled={profileUploading}
                onClick={() => setSelectedFile(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 px-4 py-2 text-sm font-bold text-white rounded-lg disabled:bg-gray-200"
                disabled={profileUploading}
                onClick={saveProfileImage}
              >
                Save
              </button>
            </div>
          </div>
        ) : userInfo?.userImage ? (
          <img
            src={userInfo.userImage}
            alt="profile_pic"
            className="h-14 w-14 object-cover rounded-full cursor-pointer"
            onClick={() =>
              imageRef.current.dispatchEvent(new MouseEvent("click"))
            }
          />
        ) : (
          <UserCircleIcon
            className="h-14 w-14 rounded-full cursor-pointer"
            onClick={() =>
              imageRef.current.dispatchEvent(new MouseEvent("click"))
            }
          />
        )}
        <div>
          <input type="file" hidden ref={imageRef} onChange={addImage} />
        </div>

        <p className="font-bold text-base">Name: {userInfo?.name}</p>
        <p className="font-medium text-sm">Username: {userInfo?.username}</p>
        {userInfo?.status && (
          <p className="font-bold text-sm w-full break-words">
            Bio: <span className="font-normal">{userInfo?.status}</span>
          </p>
        )}
        <>
          {openMessage && (
            <textarea
              value={statusMessage}
              rows={5}
              className="bg-white rounded text-sm px-4 py-2"
              placeholder="Enter Bio"
              onChange={(e) => setStatusMessage(e.target.value)}
            />
          )}
          <div className="flex space-x-2 py-4">
            <button
              className={`self-start border ${
                openMessage ? "bg-red-600 text-white" : "bg-white text-black"
              }  px-4 py-2 rounded-lg disabled:bg-gray-200`}
              onClick={() => setOpenMessageArea((prev) => !prev)}
              disabled={statusUpdating}
            >
              {openMessage ? "Cancel" : "Edit Bio"}
            </button>

            {openMessage && (
              <button
                className="self-start border text-white bg-green-600 px-4 py-2 rounded-lg disabled:bg-gray-200"
                onClick={saveStatus}
                disabled={statusUpdating}
              >
                Save
              </button>
            )}
          </div>
        </>
      </div>

      {/* right */}
      <div className="flex items-center space-x-4 lg:basis-1/2 lg:py-10">
        {/* followers */}
        <div className="flex flex-col space-y-2 lg:items-center">
          <p className="font-bold text-xl">{followers || 0}</p>
          <p className="font-medium text-lg">Followers</p>
        </div>
        {/* following */}
        <div className="flex flex-col space-y-2 lg:items-center">
          <p className="font-bold text-xl">{following || 0}</p>
          <p className="font-medium text-lg">Following</p>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
