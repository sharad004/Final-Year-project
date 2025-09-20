
import math
from collections import defaultdict
import numpy as np
from scipy.sparse import csr_matrix

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

