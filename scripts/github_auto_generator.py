import os
import requests
import base64
from typing import List, Optional
from google import genai
from google.genai import types

def generate_content(images: List[str], prompt: str, model_name: str = "gemini-2.5-flash") -> str:
    """
    High-level function to generate content using the Gemini API.
    Takes a list of local image paths and a text prompt.
    """
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    parts = []
    
    # Process images if any
    for image_path in images:
        if os.path.exists(image_path):
            with open(image_path, "rb") as f:
                image_bytes = f.read()
            # Determine mime type naively
            ext = image_path.lower().split('.')[-1]
            mime_type = "image/png"
            if ext in ["jpg", "jpeg"]:
                mime_type = "image/jpeg"
            elif ext == "webp":
                mime_type = "image/webp"
                
            parts.append(
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            )
        else:
            print(f"Warning: Image path {image_path} does not exist.")

    # Add the text prompt
    parts.append(types.Part.from_text(text=prompt))
    
    contents = [
        types.Content(
            role="user",
            parts=parts,
        ),
    ]
    
    tools = [
        types.Tool(googleSearch=types.GoogleSearch()),
    ]
    
    generate_content_config = types.GenerateContentConfig(
        tools=tools,
        temperature=0.7,
    )

    print(f"Generating content using {model_name}...")
    
    response_text = ""
    try:
        for chunk in client.models.generate_content_stream(
            model=model_name,
            contents=contents,
            config=generate_content_config,
        ):
            if text := chunk.text:
                response_text += text
    except Exception as e:
        print(f"Error during content generation: {e}")
        
    return response_text


def _fetch_github_repo_data(repo_owner: str, repo_name: str, github_token: str) -> Optional[dict]:
    """
    Private function to fetch a repository's metadata and its README using the GitHub API.
    """
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    # Fetch Repo Info
    repo_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
    repo_res = requests.get(repo_url, headers=headers)
    
    if repo_res.status_code != 200:
        print(f"Error fetching repo {repo_name}: {repo_res.status_code}")
        return None
        
    repo_data = repo_res.json()
    
    # Fetch README
    readme_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/readme"
    readme_res = requests.get(readme_url, headers=headers)
    
    readme_content = ""
    if readme_res.status_code == 200:
        readme_data = readme_res.json()
        readme_content = base64.b64decode(readme_data.get('content', '')).decode('utf-8')
    else:
        print(f"Warning: No README found for {repo_name}")
        
    return {
        "name": repo_data.get("name"),
        "description": repo_data.get("description"),
        "language": repo_data.get("language"),
        "stars": repo_data.get("stargazers_count"),
        "readme": readme_content
    }


def _generate_project_description(repo_data: dict) -> str:
    """
    Uses the high-level generate_content function to write a portfolio description.
    """
    prompt = f"""
    You are an expert copywriter for an Awwwards-winning developer portfolio.
    I am providing you with the metadata and README of a GitHub project.
    
    Project Name: {repo_data['name']}
    Original Description: {repo_data['description']}
    Primary Language: {repo_data['language']}
    
    README content:
    {repo_data['readme'][:3000]}  # Truncated to avoid massive context
    
    Please write a 2-paragraph, premium, engaging description of this project suitable for a high-end creative portfolio case study. 
    Do not use markdown headers, just the text.
    """
    
    # Using gemini-2.5-flash for text analysis (as it has active quota)
    return generate_content(images=[], prompt=prompt, model_name="gemini-2.5-flash")


def _generate_project_cover(project_name: str, description: str) -> str:
    """
    Generates an aesthetic SVG cover image using nano-banana-pro-preview based on the project description.
    """
    prompt = f"""
    You are an expert SVG designer. Create a highly aesthetic, premium, abstract SVG cover image for a GitHub project.
    
    Project Name: {project_name}
    Project Description: {description}
    
    The SVG should use modern gradients, glassmorphism, or abstract tech patterns.
    ViewBox must be "0 0 800 600".
    Return ONLY valid SVG code. Do not wrap it in markdown blocks, no other text. Just <svg>...</svg>.
    """
    
    # The previous image-specific models hit a 'limit: 0' quota on the current API key.
    # We will use gemini-2.5-flash to generate the raw SVG code representation instead!
    svg_content = generate_content(images=[], prompt=prompt, model_name="gemini-2.5-flash")
    
    # Clean up markdown if the model hallucinated it
    svg_content = svg_content.replace('```xml', '').replace('```svg', '').replace('```', '').strip()
    return svg_content


def main():
    import argparse
    parser = argparse.ArgumentParser(description="AI GitHub Project Description and Cover Generator")
    parser.add_argument("--owner", type=str, required=True, help="GitHub repository owner (username)")
    parser.add_argument("--repo", type=str, required=True, help="GitHub repository name")
    
    args = parser.parse_args()
    
    github_token = os.environ.get("GITHUB_TOKEN")
    if not github_token:
        print("Error: GITHUB_TOKEN environment variable is not set.")
        return
        
    if not os.environ.get("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY environment variable is not set.")
        return
        
    print(f"Fetching GitHub data for {args.owner}/{args.repo}...")
    repo_data = _fetch_github_repo_data(args.owner, args.repo, github_token)
    
    if not repo_data:
        print("Failed to fetch repository data. Exiting.")
        return
        
    print(f"\nGenerating description for {repo_data['name']}...")
    description = _generate_project_description(repo_data)
    
    print("\n--- Generated Description ---")
    print(description)
    print("---------------------------\n")
    
    print("Generating cover image (SVG) via nano-banana-pro-preview...")
    svg_code = _generate_project_cover(repo_data['name'], description)
    
    # Save the output
    out_dir = "out"
    os.makedirs(out_dir, exist_ok=True)
    
    desc_path = os.path.join(out_dir, f"{args.repo}_desc.txt")
    with open(desc_path, "w", encoding="utf-8") as f:
        f.write(description)
        
    svg_path = os.path.join(out_dir, f"{args.repo}_cover.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_code)
        
    print(f"Saved description to {desc_path}")
    print(f"Saved SVG cover to {svg_path}")

if __name__ == "__main__":
    main()
