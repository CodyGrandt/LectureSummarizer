from transformers import pipeline

summarizer = pipeline("summarization" , model="t5-base", tokenizer="t5-base")

text = """
In a shocking finding, scientist discovered a herd of unicorns living in a remote, previously unexplored valley, in the Andes Mountains. Even more surprising to the researchers was the fact that the unicorns spoke perfect English. The lead scientist, Dr. Jane Smith, stated that the discovery could change everything we know about these mythical creatures."""

summary = summarizer ( text , max_length=80, do_sample=False )

print("Summary:", summary[0]['summary_text'])