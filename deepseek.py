# %%
#Copyright (c) 2025 Intel Corporation

# %% [markdown]
# 
# ### **1. Introduction**
# 
# #### Purpose
# This notebook is designed to demonstrate how to run the **distilled versions of the DeepSeek R1 Reasoning model family**. These models are optimized for structured thinking and reasoning tasks and are lightweight enough to run on a single Intel Max Series 1100 GPU with 48 GB of VRAM.
# 
# #### Highlights
# 1. **Distilled Models**: Focused versions of DeepSeek R1 for better performance on limited hardware.
# 2. **Interactive Mode**: Engage directly with the models through a simple interface.
# 3. **Device Agnostic**: Automatically selects GPU (`xpu`) or CPU based on availability.
# 
# ---
# 

# %% [markdown]
# #### Required packages
# 
# Ensure the required libraries (`transformers`, `accelerate`, `IProgress` and others) are installed.

# %%
import sys
import site
import os
import subprocess
import importlib
from typing import Union, List

def pip_install(packages: Union[str, List[str]], version: Union[str, List[str]] = None) -> None:
    """
    Install packages using pip and update Python path to make them immediately available.
    """
    if isinstance(packages, str):
        packages = [packages]
    
    if version and isinstance(version, str):
        version = [version]
    
    if version:
        if len(version) != len(packages):
            raise ValueError("If versions are specified, they must match the number of packages")
        install_packages = [f"{pkg}>={ver}" if ver else pkg for pkg, ver in zip(packages, version)]
    else:
        install_packages = packages
    
    for pkg in install_packages:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", pkg])
        except subprocess.CalledProcessError as e:
            print(f"Failed to install {pkg}: {str(e)}")
            continue
    
    site_packages_dir = site.getsitepackages()[0]    
    
    if not os.access(site_packages_dir, os.W_OK):
        user_site_packages_dir = site.getusersitepackages()
        if user_site_packages_dir in sys.path:
            sys.path.remove(user_site_packages_dir)
        sys.path.insert(0, user_site_packages_dir)
        globals()['__path_updated'] = user_site_packages_dir
    else:
        if site_packages_dir in sys.path:
            sys.path.remove(site_packages_dir)
        sys.path.insert(0, site_packages_dir)
        globals()['__path_updated'] = site_packages_dir
    
    for package in packages:
        base_package = package.split('>')[0].strip()
        if base_package in sys.modules:
            try:
                importlib.reload(sys.modules[base_package])
            except:
                pass

# Example usage:
# Single package:
# pip_install("transformers", "4.38.0")

# Multiple packages:
# pip_install(
#     ["transformers", "datasets", "wandb"],
#     ["4.38.0", "2.18.0", "0.16.0"]
# )

# Without version:
# pip_install("transformers")
# pip_install(["transformers", "datasets"])

# %% [markdown]
# # pip_install(["transformers",
#              "tqdm",
#              "IPywidgets",
#              "tqdm",
#              "IPywidgets",
#              "accelerate",
#              "ninja",
#              "networkx",
#              "sympy==1.13.1"]) 

# %% [markdown]
# ___

# %% [markdown]
# #### Setting Environment Variables for Optimizing Intel GPU Performance
# 
# These settings enable advanced features like immediate command lists, system management, and persistent caching, which are crucial for optimizing workloads on Intel's GPU stack.
# 

# %%
import os

os.environ["SYCL_PI_LEVEL_ZERO_USE_IMMEDIATE_COMMANDLISTS"] = "1"
os.environ["ENABLE_SDP_FUSION"] = "1"
os.environ["ZES_ENABLE_SYSMAN"] = "1"
os.environ["SYCL_CACHE_PERSISTENT"] = "1"

# %% [markdown]
# ____

# %% [markdown]
# #### Importing Libraries and Model List
# 
# This section imports necessary Python libraries and defines a list of available models.

# %%
import re
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from IPython.display import display, Markdown

MODEL_LIST = [
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
]

# %% [markdown]
# ___

# %% [markdown]
# #### Selecting Device
# The following function selects the device for running the model. It uses xpu if available, otherwise defaults to cpu.

# %%
def select_device(preferred_device="xpu"):
    """Select the device to use (xpu or cpu)."""
    if torch.xpu.is_available():
        print("xpu is available")
        return "xpu"
        print("xpu not available, using cpu")
    return "cpu"

# %% [markdown]
# #### Loading Model and Tokenizer
# This function loads the model and tokenizer directly from Hugging Face, ensuring compatibility with Intel devices.

# %%
def load_model_and_tokenizer(model_id_or_path, device, torch_dtype):
    """Load the model and tokenizer directly from Hugging Face."""
    print(f"Downloading model and tokenizer: {model_id_or_path}")
    tokenizer = AutoTokenizer.from_pretrained(model_id_or_path, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_id_or_path,
        trust_remote_code=True,
        torch_dtype=torch_dtype,
    ).to(device).eval()
    return tokenizer, model

# %% [markdown]
# ___

# %% [markdown]
# #### Prepare input and Generate output
# 
# The function `prepare_input` encodes user input into a format suitable for the model. The function `geneate_output` generates the model's output based on the prepared input. It includes various parameters like max_length, temperature, and repetition_penalty for fine-tuning the response.

# %%
def prepare_input(tokenizer, user_input, device):
    """Prepare input IDs for the model."""
    user_input = (
        f"### Instruction:\n{user_input}\n\n### Response:"
    )
    input_ids = tokenizer.encode(user_input, return_tensors="pt", truncation=False)
    return input_ids.to(device=device)

def generate_output(model, tokenizer, 
                    input_ids, device, 
                    torch_dtype, max_length=4096, 
                    temperature=0.7, top_p=0.9, 
                    top_k=50, num_beams=1, 
                    repetition_penalty=1.2):
    """Generate output from the model."""
    with torch.autocast(device_type="xpu", dtype=torch.bfloat16):
        with torch.no_grad():
            output = model.generate(
                input_ids,                
                pad_token_id=tokenizer.eos_token_id,
                max_length=max_length,
                temperature=temperature,
                top_p=top_p,
                top_k=top_k,
                num_beams=num_beams,
                repetition_penalty=repetition_penalty,
            )
    return output

def process_generated_text(tokenizer, output_ids):
    """Process the generated text."""
    generated_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    match = re.search(r'### Response:(.*)', generated_text, re.S)
    if match:
        return match.group(1).strip()
    return generated_text.strip()

# %% [markdown]
# ___

# %% [markdown]
# #### Main Logic for Model Selection
# This section provides a list of available models, allows the user to select one, and starts the interactive session.

# %%
def run_model_interactively(model_id):
    """Run the selected model interactively for structured tasks."""
    
    print(f"Loading model and tokenizer...: {model_id}")
    tokenizer, model = load_model_and_tokenizer(model_id, device, torch_dtype)
    
    print("\nWelcome! This model is designed for structured thinking and reasoning tasks.")
    print("Provide an instruction or a task for the model to think about.")
    print("Type 'exit' to quit the session.\n")

    while True:
        user_input = input("Enter your task or instruction: ")
        if user_input.lower() == "exit":
            print("Exiting. Goodbye!")
            break
        input_ids = prepare_input(tokenizer, user_input, device)
        output_ids = generate_output(
            model,
            tokenizer,
            input_ids,
            device,
            torch_dtype,
            max_length=4096,
            temperature=0.7,
            top_p=0.9,
            top_k=50,
            num_beams=1,
            repetition_penalty=1.2,
        )
        generated_text = process_generated_text(tokenizer, output_ids)
        display(Markdown(f"### Model's Response:\n{generated_text}"))

# %% [markdown]
# #### Main Logic for Model Selection
# This section provides a list of available models, allows the user to select one, and starts the interactive session.

# %%
device = select_device("xpu")
torch_dtype = torch.bfloat16

print("Available models:")
for idx, model_name in enumerate(MODEL_LIST, start=1):
    print(f"{idx}. {model_name}")

model_choice = int(input("Select a model by entering its number: ")) - 1
if 0 <= model_choice < len(MODEL_LIST):
    selected_model = MODEL_LIST[model_choice]
    run_model_interactively(selected_model)
else:
    print("Invalid choice. Exiting.")

# %% [markdown]
# #### License
# 
# Usage of these models must also adhere to the licensing agreements and be in accordance with ethical guidelines and best practices for AI. If you have any concerns or encounter issues with the models, please refer to the respective model cards and documentation provided in the links above.
# 
# To the extent that any public or non-Intel datasets or models are referenced by or accessed using these materials those datasets or models are provided by the third party indicated as the content source. Intel does not create the content and does not warrant its accuracy or quality. By accessing the public content, or using materials trained on or with such content, you agree to the terms associated with that content and that your use complies with the applicable license.
# 
# Intel expressly disclaims the accuracy, adequacy, or completeness of any such public content, and is not liable for any errors, omissions, or defects in the content, or for any reliance on the content. Intel is not liable for any liability or damages relating to your use of public content.
# 
# Intel’s provision of these resources does not expand or otherwise alter Intel’s applicable published warranties or warranty disclaimers for Intel products or solutions, and no additional obligations, indemnifications, or liabilities arise from Intel providing such resources. Intel reserves the right, without notice, to make corrections, enhancements, improvements, and other changes to its materials.
# 
# ##### License for DeepSeek-R1
# 
# This code repository and the model weights are licensed under the **MIT License**. The DeepSeek-R1 series supports commercial use, allows for modifications and derivative works, including but not limited to distillation for training other LLMs. Below are additional details about the model derivations:
# 
# - **DeepSeek-R1-Distill-Qwen Models**:
#   - **1.5B, 7B, 14B, and 32B**:  
#     Derived from the **Qwen-2.5 series**, originally licensed under the **Apache 2.0 License**. These models are fine-tuned using 800k samples curated with DeepSeek-R1.
# 
# - **DeepSeek-R1-Distill-Llama Models**:
#   - **8B**:  
#     Derived from **Llama3.1-8B-Base**, originally licensed under the **Llama3.1 license**.
#   - **70B**:  
#     Derived from **Llama3.3-70B-Instruct**, originally licensed under the **Llama3.3 license**.
# 
# ---

# %% [markdown]
# 
# #### Citation for DeepSeek-R1
# 
# If you use the DeepSeek-R1 models in your research or projects, please cite the work as follows:
# 
# ```bibtex
# @misc{deepseekai2025deepseekr1incentivizingreasoningcapability,
#       title={DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning}, 
#       author={DeepSeek-AI and Daya Guo and Dejian Yang and Haowei Zhang and Junxiao Song and Ruoyu Zhang and Runxin Xu and Qihao Zhu and Shirong Ma and Peiyi Wang and Xiao Bi and Xiaokang Zhang and Xingkai Yu and Yu Wu and Z. F. Wu and Zhibin Gou and Zhihong Shao and Zhuoshu Li and Ziyi Gao and Aixin Liu and Bing Xue and Bingxuan Wang and Bochao Wu and Bei Feng and Chengda Lu and Chenggang Zhao and Chengqi Deng and Chenyu Zhang and Chong Ruan and Damai Dai and Deli Chen and Dongjie Ji and Erhang Li and Fangyun Lin and Fucong Dai and Fuli Luo and Guangbo Hao and Guanting Chen and Guowei Li and H. Zhang and Han Bao and Hanwei Xu and Haocheng Wang and Honghui Ding and Huajian Xin and Huazuo Gao and Hui Qu and Hui Li and Jianzhong Guo and Jiashi Li and Jiawei Wang and Jingchang Chen and Jingyang Yuan and Junjie Qiu and Junlong Li and J. L. Cai and Jiaqi Ni and Jian Liang and Jin Chen and Kai Dong and Kai Hu and Kaige Gao and Kang Guan and Kexin Huang and Kuai Yu and Lean Wang and Lecong Zhang and Liang Zhao and Litong Wang and Liyue Zhang and Lei Xu and Leyi Xia and Mingchuan Zhang and Minghua Zhang and Minghui Tang and Meng Li and Miaojun Wang and Mingming Li and Ning Tian and Panpan Huang and Peng Zhang and Qiancheng Wang and Qinyu Chen and Qiushi Du and Ruiqi Ge and Ruisong Zhang and Ruizhe Pan and Runji Wang and R. J. Chen and R. L. Jin and Ruyi Chen and Shanghao Lu and Shangyan Zhou and Shanhuang Chen and Shengfeng Ye and Shiyu Wang and Shuiping Yu and Shunfeng Zhou and Shuting Pan and S. S. Li and Shuang Zhou and Shaoqing Wu and Shengfeng Ye and Tao Yun and Tian Pei and Tianyu Sun and T. Wang and Wangding Zeng and Wanjia Zhao and Wen Liu and Wenfeng Liang and Wenjun Gao and Wenqin Yu and Wentao Zhang and W. L. Xiao and Wei An and Xiaodong Liu and Xiaohan Wang and Xiaokang Chen and Xiaotao Nie and Xin Cheng and Xin Liu and Xin Xie and Xingchao Liu and Xinyu Yang and Xinyuan Li and Xuecheng Su and Xuheng Lin and X. Q. Li and Xiangyue Jin and Xiaojin Shen and Xiaosha Chen and Xiaowen Sun and Xiaoxiang Wang and Xinnan Song and Xinyi Zhou and Xianzu Wang and Xinxia Shan and Y. K. Li and Y. Q. Wang and Y. X. Wei and Yang Zhang and Yanhong Xu and Yao Li and Yao Zhao and Yaofeng Sun and Yaohui Wang and Yi Yu and Yichao Zhang and Yifan Shi and Yiliang Xiong and Ying He and Yishi Piao and Yisong Wang and Yixuan Tan and Yiyang Ma and Yiyuan Liu and Yongqiang Guo and Yuan Ou and Yuduan Wang and Yue Gong and Yuheng Zou and Yujia He and Yunfan Xiong and Yuxiang Luo and Yuxiang You and Yuxuan Liu and Yuyang Zhou and Y. X. Zhu and Yanhong Xu and Yanping Huang and Yaohui Li and Yi Zheng and Yuchen Zhu and Yunxian Ma and Ying Tang and Yukun Zha and Yuting Yan and Z. Z. Ren and Zehui Ren and Zhangli Sha and Zhe Fu and Zhean Xu and Zhenda Xie and Zhengyan Zhang and Zhewen Hao and Zhicheng Ma and Zhigang Yan and Zhiyu Wu and Zihui Gu and Zijia Zhu and Zijun Liu and Zilin Li and Ziwei Xie and Ziyang Song and Zizheng Pan and Zhen Huang and Zhipeng Xu and Zhongyu Zhang and Zhen Zhang},
#       year={2025},
#       eprint={2501.12948},
#       archivePrefix={arXiv},
#       primaryClass={cs.CL},
#       url={https://arxiv.org/abs/2501.12948}, 
# }

# %% [markdown]
# # 


