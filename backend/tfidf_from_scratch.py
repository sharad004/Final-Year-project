
import math
from collections import defaultdict
import numpy as np
from scipy.sparse import csr_matrix


# class TFIDFVectorizerFromScratch:
#     def __init__(self):
#         self.vocab = []
#         self.word2index = {}
#         self.idf_dict = {}

#     def fit(self, documents):
#         """
#         Learn the vocabulary and compute IDF values from a list of documents
#         """
#         # Build vocabulary
#         vocab_set = set()
#         for doc in documents:
#             for word in doc.split():
#                 vocab_set.add(word)
#         self.vocab = list(vocab_set)
#         self.word2index = {word: i for i, word in enumerate(self.vocab)}

#         # Compute IDF
#         N = len(documents)
#         self.idf_dict = {}
#         for word in self.vocab:
#             count = sum(1 for doc in documents if word in doc.split())
#             self.idf_dict[word] = math.log((N + 1) / (count + 1)) + 1  # smoothed IDF

#     def transform(self, documents):
#         """
#         Transform a list of documents to TF-IDF vectors
#         """
#         tfidf_vectors = []

#         for doc in documents:
#             tf_dict = defaultdict(int)
#             words = doc.split()
#             for word in words:
#                 tf_dict[word] += 1
#             total_words = len(words)
#             for word in tf_dict:
#                 tf_dict[word] = tf_dict[word] / total_words  # normalize TF

#             vector = [0] * len(self.vocab)
#             for word, tf_val in tf_dict.items():
#                 if word in self.word2index:
#                     index = self.word2index[word]
#                     vector[index] = tf_val * self.idf_dict[word]
#             tfidf_vectors.append(vector)

#         return np.array(tfidf_vectors)

#     def fit_transform(self, documents):
#         """
#         Fit to documents and return TF-IDF vectors
#         """
#         self.fit(documents)
#         return self.transform(documents)


# tfidf_optimized.py
import numpy as np
from scipy.sparse import csr_matrix
from collections import Counter
import math

class TFIDFVectorizerOptimized:
    """
    Optimized TF-IDF Vectorizer from scratch.

    Features:
    - Sparse matrix output (memory efficient)
    - Vectorized operations using NumPy
    - Efficient vocabulary and IDF computation
    - Can handle large datasets (44k+ articles) quickly
    """

    def __init__(self):
        self.vocab = []
        self.word2index = {}
        self.idf_vector = None  # IDF as numpy array for vectorized computation

    def fit(self, documents):
        """
        Build vocabulary and compute IDF.
        documents: list of strings
        """
        # Build vocabulary
        vocab_set = set()
        for doc in documents:
            vocab_set.update(doc.split())

        self.vocab = sorted(list(vocab_set))  # sort for reproducibility
        self.word2index = {word: i for i, word in enumerate(self.vocab)}

        N = len(documents)
        # Compute DF (document frequency) efficiently
        df = np.zeros(len(self.vocab))
        for doc in documents:
            unique_words = set(doc.split())
            for word in unique_words:
                df[self.word2index[word]] += 1

        # Compute IDF vector (log scaling)
        self.idf_vector = np.log((N + 1) / (df + 1)) + 1  # same as scikit-learn
        # Optimized: storing IDF as numpy array for vectorized TF-IDF computation

    def transform(self, documents):
        """
        Transform documents into TF-IDF sparse matrix.
        Returns: scipy csr_matrix
        """
        rows, cols, data = [], [], []

        for i, doc in enumerate(documents):
            words = doc.split()
            tf_counter = Counter(words)
            total_words = len(words)

            # Build sparse TF-IDF entries for this document
            for word, count in tf_counter.items():
                if word in self.word2index:
                    j = self.word2index[word]
                    tf = count / total_words
                    tfidf = tf * self.idf_vector[j]
                    rows.append(i)
                    cols.append(j)
                    data.append(tfidf)

        # Convert lists to sparse CSR matrix
        return csr_matrix((data, (rows, cols)), shape=(len(documents), len(self.vocab)))

    def fit_transform(self, documents):
        """
        Convenience method: fit + transform
        """
        self.fit(documents)
        return self.transform(documents)

