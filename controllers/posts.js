const cloudinary = require('../middleware/cloudinary');
// Models
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const SavedPost = require('../models/SavedPost');
// Azure Ai
const azure = require('../middleware/azure');
const computerVisionClient = azure.computerVisionClient;
const sleep = azure.sleep;
module.exports = {
  // !profiles
  // provider profile
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ postedBy: req.user.id })
        .sort({ createdAt: 'desc' })
        .lean();
      res.render('provider-profile.ejs', { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // student profile
  getStudentProfile: async (req, res) => {
    try {
      const posts = await SavedPost.find({ savedBy: req.user.id })
        .sort({ createdAt: 'desc' })
        .lean();
      res.render('student-profile.ejs', { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // guest profile
  // !signup check
  getSignUpCheck: async (req, res) => {
    try {
      res.render('signup-check.ejs');
    } catch (err) {
      console.log(err);
    }
  },

  // !post page
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ postId: req.params.id });
      // todo comments
      res.render('post.ejs', {
        post: post,
        comments: comments,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
    }
  },
  // !signup check
  getMakePost: async (req, res) => {
    try {
      res.render('make-post.ejs', { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // !create posts
  // post scholarship
  createPost: async (req, res) => {
    try {
      let user = req.user._id;
      let userName = req.user.name;

      const expirationDate = req.body.expiryDate;
      const expireAt = new Date(req.body.expiryDate);
      console.log('DATE:', new Date(req.body.expiryDate));
      const result = await cloudinary.uploader.upload(req.file.path);
      const brandURLImage = result.secure_url;
      let DACA = 0;
      let check;

      // !AI checks for DACA
      // URL images containing printed and/or handwritten text.
      // The URL can point to image files (.jpg/.png/.bmp) or multi-page files (.pdf, .tiff).
      const printedTextSampleURL = brandURLImage;
      // Status strings returned from Read API. NOTE: CASING IS SIGNIFICANT.
      // Before Read 3.0, these are "Succeeded" and "Failed"
      const STATUS_SUCCEEDED = 'succeeded';
      const STATUS_FAILED = 'failed';
      // Recognize text in printed image from a URL
      console.log(
        'Read printed text from URL...',
        printedTextSampleURL.split('/').pop()
      );
      const printedResult = await readTextFromURL(
        computerVisionClient,
        printedTextSampleURL
      );
      printRecText(printedResult);

      // Prints all text from Read result
      function printRecText(readResults) {
        console.log('Recognized text:');
        for (const page in readResults) {
          if (readResults.length > 1) {
            console.log(`==== Page: ${page}`);
          }
          const result = readResults[page];
          check = result;

          if (result.lines.length) {
            for (const line of result.lines) {
              console.log('map result', line.words.map(w => w.text).join(' '));
            }
          } else {
            console.log('No recognized text.');
          }
        }
      }
      // Perform read and await the result from URL
      async function readTextFromURL(client, url) {
        // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
        let result = await client.read(url);
        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];

        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== STATUS_SUCCEEDED) {
          await sleep(1000);
          result = await client.getReadResult(operation);
        }
        return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
      }

      const resultingArr = check.lines;
      resultingArr.forEach(line => {
        if (line.text.includes('DACA')) {
          console.log('DACAFOUND!');
          DACA = 1;
        }
        // else {
        //   console.log('NO DACA');
        // }
      });

      await Post.create({
        expireAt: new Date(expireAt),
        expirationDate: expirationDate,
        title: req.body.title,
        caption: req.body.caption,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        userName: userName,
        postedBy: user,
        DACA: DACA,
      });
      // TODo may need to await Post.createIndex
      // Post.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
      console.log('Post has been added!');
      res.redirect('/provider-profile');
    } catch (err) {
      console.log(err);
    }
  },
  // !Save post
  createSavedPost: async (req, res) => {
    let user = req.user._id;
    let userName = req.user.email;
    let postId = req.body.postId;
    let providerName = req.body.providerName;
    let postedBy = req.body.postedBy;
    let expirationDate = req.body.expiryDate;
    let DACA = req.body.DACA;
    try {
      await SavedPost.create({
        title: req.body.title,
        caption: req.body.caption,
        userName: userName,
        postedBy: postedBy,
        postId: postId,
        providerName: providerName,
        savedBy: user,
        DACA: Number(DACA),
        expirationDate: expirationDate,
      });
      console.log('Post has been added!');
      res.redirect(`/student-profile`);
    } catch {}
  },
  // !Comment on Post
  createComment: async (req, res) => {
    let userName = req.user.name;
    let profileType = req.user.profileType;
    let postId = req.params.postId;
    console.log('commentId =>', postId);
    let expireAt = req.body.expirationDate;
    try {
      await Comment.create({
        expireAt: new Date(expireAt),
        // expirationDate: expirationDate,
        comment: req.body.comment,
        postId: postId,
        userName: userName,
        profileType: profileType,
      });
      // TODo may need to await Post.createIndex
      // Post.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
      console.log('Post has been added!');
      res.redirect(`/post/${postId}`);
    } catch {}
  },
  // *sample put
  // likePost: async (req, res) => {
  //   try {
  //     await Post.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { likes: 1 },
  //       }
  //     );
  //     console.log('Likes +1');
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // !delete
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await SavedPost.findById({ _id: req.params.id });

      // Delete post from db
      await SavedPost.remove({ _id: req.params.id });
      console.log('Deleted Post');
      res.redirect(`/student-profile`);
    } catch (err) {
      console.log(err);
      res.redirect(`/student-profile`);
    }
  },
  deleteProvPost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log('Deleted Post');
      res.redirect(`/provider-profile`);
    } catch (err) {
      console.log(err);
      res.redirect(`/provider-profile`);
    }
  },
};
